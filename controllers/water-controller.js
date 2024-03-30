import { User } from "../models/userModel.js";

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export const waterRateController = async (req, res) => {
    const { waterRate } = req.body;
    const { id } = req.user;

    await User.findByIdAndUpdate(id, { waterRate });
    res.status(200).json({
        'message': 'Water Rate was changed successful'
    });
};

export const addWaterController = async (req, res) => {
    const { id } = req.user;
    const { date, time, waterAmount } = req.body;
    let sep
    if (date.includes('/')) sep = '/'
    else if (date.includes('-')) sep = '-'
    const [day, month, year] = date.split(sep);
    const { waterRate, waters } = await User.findById(id);
    const stringMonth = months[Number(month) - 1]
    // First data added or new month and year
    const isNewMonthAndYear = waters.find(water => water.month !== stringMonth && water.year !== year);
    console.log(isNewMonthAndYear)
    if (!waters.length || isNewMonthAndYear) {
        const firstData = {
            month: months[Number(month) - 1],
            year,
            useWater:[{day,
                    "waterRateForThisDay": waterRate,
                    "useForDay":  [{time, amount: waterAmount }],
                    "allAmountforDay": waterAmount
            }]
                    
        }
        
        await User.findByIdAndUpdate(id, { $push:{waters: firstData} }, {new: true});
        return res.json({
            "message": "New water portion is added successful"
        })
    };
    // First data for new day in current month and year
    // const { useWater } = waters.find(water => water.month === stringMonth && water.year === year);
    // const firstDataForNewDay = {
    //     day,
    //     waterRateForThisDay: waterRate,
    //     useForDay: [{time, amount: waterAmount }],
    //     allAmountforDay: waterAmount
    // }
    // if (useWater.find(item => item.day !== day)) {
    //     const user = await User.findByIdAndUpdate(id, { $push:{useWater: firstDataForNewDay} }, { new: true });
    //     return res.json({
    //         "message": `New date ${date} is added successful`,
    //         user
    //     })
    // }

    res.json({
       "message": "Success"
    })
}
