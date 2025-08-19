const User = require('./userModel');
const path = require('path');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

let userLoginEmail = ''; // Global variable to store email of the logged-in user

exports.signup = async (req, res) => {
    const { fullname, email, username, password, confirm_password } = req.body;

    if (password !== confirm_password) {
        return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    const newUser = new User({ fullname, email, username, password });

    try {
        await newUser.save();
        userLoginEmail = email;
        return res.json({ success: true, message: 'User registered successfully', dashboard: 'user' });
    } catch (err) {
        console.error('Error during user registration:', err); // Log the error for debugging

        if (err.code === 11000) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        } else {
            return res.status(500).json({ success: false, message: 'Failed to register user: ' + err.message });
        }
    }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the username and password match the admin credentials
        if (email === 'Admin786@gmail.com' && password === 'Admin43600') {
            const adminDashboardPath = path.join(__dirname, '..', 'adminDashboard.html');
            return res.json({ success: true, message: 'Login successful', dashboard: 'admin' });
        } else {
            const user = await User.findOne({ email, password });
            if (!user) {
                return res.status(400).json({ success: false, message: 'Invalid username or password' });
            }

            userLoginEmail = email; // Store the email of the logged-in user
            return res.json({ success: true, message: 'Login successful', dashboard: 'user' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};



exports.billing = async (req, res) => {
    try {
        const { amount, account_name} = req.body;
        const receipt_image = req.file.buffer; // Get image buffer from multer

        const user = await User.findOne({ email: userLoginEmail });
        if (!user) {
            return res.json({ success: false, message: 'User Not Found', dashboard: 'user' });
        }

        const billing = { amount, account_name, receipt_image, isApproved: false, createdAt: new Date() };
        user.billings.push(billing);

        await user.save();

        return res.json({ success: true, message: 'Billing added successfully. You will be directed to userDashboard', dashboard: 'user' });
    } catch (err) {
        return res.json({ success: false, message: 'Billing Failed', dashboard: 'user' });
    }
};


exports.DeleteWholeBilling = async (req, res) => {
    const { userId, billingId } = req.params;
    
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const billingIndex = user.billings.findIndex(billing => billing._id.toString() === billingId);
        if (billingIndex === -1) {
            return res.status(404).json({ message: 'Billing not found' });
        }

        user.billings.splice(billingIndex, 1);
        await user.save();

        return res.status(200).json({ message: 'Billing deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};


exports.getUserInfo = async (req, res) => {
    try {
        console.log('Fetching user information...');
        const users = await User.find();

        if (!users || users.length === 0) {
            console.log('No users found');
            return res.status(404).json({ error: 'No users found' });
        }

        const usersInfo = users.map(user => ({
            _id: user._id,
            username: user.username,
            email: user.email,
            totalWithdraw: user.accountSummary ? user.accountSummary.TotalWithdraw : 0,
            billings: user.billings.map(billing => ({
                _id: billing._id,
                amount: billing.amount,
                profit: billing.profit,
                account_name: billing.account_name,
                receipt_image: billing.receipt_image ? billing.receipt_image.toString('base64') : '',
                isApproved: billing.isApproved
            }))
        }));

        console.log('User information retrieved successfully:', usersInfo);
        res.status(200).json(usersInfo);
    } catch (err) {
        console.error('Failed to retrieve user information:', err.message);
        res.status(500).json({ error: 'Failed to retrieve user information: ' + err.message });
    }
};
exports.getUserWithDrawInfo = async (req, res) => {
    try {
        console.log('Fetching user information...');
        const users = await User.find();

        if (!users || users.length === 0) {
            console.log('No users found');
            return res.status(404).json({ error: 'No users found' });
        }

        const userswithdraw = users.map(user => ({
            username: user.username,
            email: user.email,
            withdrawings: user.withdrawings.map(withdraw => ({
                amount: withdraw.amount,
                accountNo: withdraw.accountNo,
                accountName: withdraw.accountName
            }))
        }));

        console.log('User information retrieved successfully:',userswithdraw);
        res.status(200).json(userswithdraw);
    } catch (err) {
        console.error('Failed to retrieve user information:', err.message);
        res.status(500).json({ error: 'Failed to retrieve user information: ' + err.message });
    }
};
// userController.js
// In userController.js
exports.DeleteWholeWithDraw = async (req, res) => {
    const { userId, withdrawId } = req.params;
    
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const withdrawIndex = user.withdrawings.findIndex(withdraw => withdraw._id.toString() === withdrawId);
        if (withdrawIndex === -1) {
            return res.status(404).json({ message: 'Withdrawal not found' });
        }

        user.withdrawings.splice(withdrawIndex, 1);
        await user.save();

        return res.status(200).json({ message: 'Withdrawal deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};


exports.updateStatus = async (req, res) => {
    const { userId, billingId } = req.params;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const billing = user.billings.id(billingId);

        if (!billing) {
            return res.status(404).json({ message: 'Billing not found' });
        }
    //  if(billing.isApproved=="Approved")
    //     {
    //         alert("Status already approved");
    //         return res.status(200).json({ message: 'Billing status already approved found' });

    //     }
        billing.isApproved = "Approved";

        await user.save();
      
        res.status(200).json({ message: 'Status  updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update status: ' + err.message });
    }
};

exports.updateProfit = async (req, res) => {
    const { userId, billingId } = req.params;
    const { profitPercentage } = req.body;



    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const billing = user.billings.id(billingId);

        if (!billing) {
            return res.status(404).json({ message: 'Billing not found' });
        }

        billing.profit = profitPercentage;

        await user.save();

        res.status(200).json({ message: 'Profit updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update profit: ' + err.message });
    }
};

exports.calculateAccountSummary = async () => {
    try {
        const user = await User.findOne({ email: userLoginEmail });
     
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
        if (!user) {
            console.log('No users found');
            return; // or throw new Error('No users found');
        }

        
            let totalDeposit = 0;
            let totalEarning = 0;
            let totalnumberofDeposit=0;

            // Calculate total deposit and total earning for each user
            for (let billing of user.billings) {
                ++totalnumberofDeposit;
                totalDeposit += billing.amount;
                totalEarning += billing.profit; // Assuming profit is stored as percentage
            }

            // Ensure user.accountSummary exists before updating
            if (!user.accountSummary) {
                user.accountSummary = {
                    TotalDeposit: 0,
                    TotalEarning: 0,
                    TotalBalance: 0
                };
            }

            if( user.accountSummary.NumberOfDeposit!=totalnumberofDeposit)
                {
                   
                    user.accountSummary.NumberOfDeposit=totalnumberofDeposit;
                    console.log(totalnumberofDeposit);
                    user.accountSummary.TotalDeposit = totalDeposit;
                }
            
            user.accountSummary.TotalEarning += totalEarning;
            user.accountSummary.TotalBalance += totalEarning; // Assuming total balance is same as total earning

           
            await user.save();
        

        console.log('Account summary updated successfully');
    } catch (err) {
        console.error('Failed to calculate account summary:', err);
        throw err; // or handle the error as needed
    }
};
exports.getAccountSummary = async (req, res) => {
    try {
        const user = await User.findOne({ email: userLoginEmail });
console.log(userLoginEmail);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const accountSummary = user.accountSummary;

        if (!accountSummary) {
            return res.status(404).json({ message: 'Account summary not found' });
        }

        res.status(200).json({
            totalBalance: accountSummary.TotalBalance.toFixed(2),
            totalDeposit: accountSummary.TotalDeposit.toFixed(2),
            username:user.username,
            totalEarning: accountSummary.TotalEarning.toFixed(2),
            totalWithdraw: accountSummary.TotalWithdraw.toFixed(2)
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to retrieve account summary: ' + err.message });
    }
};
exports.WithDraw = async (req, res) => {
    try {
        const user = await User.findOne({ email: userLoginEmail });
        const { withDrawAmount,withDrawAccountNo,withDrawAccountName } = req.body;

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const accountSummary = user.accountSummary;

        if (!accountSummary) {
            return res.status(404).json({ success: false, message: 'Account summary not found' });
        }

        if (accountSummary.TotalBalance < withDrawAmount) {
            return res.status(400).json({ success: false, message: 'Balance is less than withdrawal amount' });
        } else {
            user.accountSummary.TotalBalance = accountSummary.TotalBalance - withDrawAmount;
            user.accountSummary.TotalWithdraw += withDrawAmount;

            // Add new withdrawal to withdrawings array
            const newWithdrawal = {
                amount: withDrawAmount,
                accountNo: withDrawAccountNo,
                accountName: withDrawAccountName
            };
            user.withdrawings.push(newWithdrawal);

            await user.save();

            return res.status(200).json({ success: true, message: 'Withdrawal done successfully' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to retrieve account summary: ' + err.message });
    }
};



// Define the handleAdClick function
exports.handleAdClick = async (req, res) => {
    const user = await User.findOne({ email: userLoginEmail });
    if (!user) {
        return res.status(404).send('User not found');
    }

    const lastClickTime = user.accountSummary.timeOfClickingAd || new Date(0); // Default to Unix epoch time
    const currentTime = new Date();
    const timeDifference = currentTime - lastClickTime; // Time difference in milliseconds

    const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    if (lastClickTime.getTime() === new Date(0).getTime() || timeDifference >= oneDay) {
        await exports.calculateAccountSummary();
       

        user.accountSummary.timeOfClickingAd = currentTime;
        await user.save();

        res.send('Congrats, You have got Reward');
    } else {
        const remainingTime = oneDay - timeDifference;
        res.send(`Please wait ${(remainingTime / (60 * 60 * 1000)).toFixed(2)} hours to watch the ad again`);
    }
};
