import { HttpError } from "../helpers/index.js";
import { User } from "../models/userModel.js";
import { Water } from "../models/waterModel.js";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const waterRateController = async (req, res) => {
  const { waterRate, date } = req.body;
  const { id } = req.user;

  let sep
  if (date.includes('/')) sep = '/'
  else if (date.includes('-')) sep = '-'
  const [day, month, year] = date.split(sep);

  await Water.updateMany({ owner: id, day, month: months[Number(month) - 1], year }, {waterRateForThisDay: waterRate});
  await User.findByIdAndUpdate(id, { waterRate }, { new: true });
  
  res.status(200).json({
    message: "Water Rate was changed successful",
  });
};

export const addWaterController = async (req, res) => {
  const { id } = req.user;
  const { date, time, waterAmount } = req.body;
  const { waterRate } = await User.findById(id);

  let sep;
  if (date.includes("/")) sep = "/";
  else if (date.includes("-")) sep = "-";
  const [day, month, year] = date.split(sep);

  const waterData = {
    day,
    month: months[Number(month) - 1],
    year,
    time,
    amount: waterAmount,
    waterRateForThisDay: waterRate,
    owner: id
  };

  const waterPortion = (await Water.create(waterData));
  
  return res.json({
    message: "New water portion is added successful",
    waterData: {
      "day": waterPortion.day,
      "month": waterPortion.month,
      "year": waterPortion.year,
      "time": waterPortion.time,
      "amount": waterPortion.amount,
      "id": waterPortion._id
    }
  
  });
};

export const deleteWaterController = async (req, res) => {
  const { id } = req.user;
  const { id: waterId } = req.params;

  const waterPortion = await Water.findOneAndDelete({ _id: waterId, owner: id });

  if (!waterPortion)
    throw HttpError(404, `There are no portions with id ${waterId}`);

  return res.status(204).json();
};

export const updateWaterController = async (req, res) => {
  const { id } = req.user;
  const { id: waterId } = req.params;
  const { time, waterAmount } = req.body;

  const waterPortion = await Water.findOne({ _id: waterId, owner: id });
  if (!waterPortion) throw HttpError(404, `There are no portions with id ${waterId}`);

  if (!time && !waterAmount) throw HttpError(400, "Must be at least one field");

 const newPortion = await Water.findByIdAndUpdate(waterId, { time: time ?? waterPortion.time, amount: waterAmount ?? waterPortion.amount }, {new: true});

  return res.json({
    message: "Water portion is updated successful",
    waterData: {
      "day": newPortion.day,
      "month": newPortion.month,
      "year": newPortion.year,
      "time": newPortion.time,
      "amount": newPortion.amount,
      "id": newPortion._id
    }
  });
};

export const getWaterInfoTodayController = async (req, res) => {
  const { id } = req.user;
  const { date } = req.body;
  let sep;
  if (date.includes("/")) sep = "/";
  else if (date.includes("-")) sep = "-";
  const [day, month, year] = date.split(sep);

  const allWater = await Water.find({ owner: id, day, month: months[Number(month) - 1], year });
  
  if (allWater.length === 0) {
    return res.json({
      day,
      month: months[Number(month) - 1],
      year,
      portionsOfWater: allWater,
    });
    
  }

  const filteredWaters = allWater.map(water => ({ time: water.time, amount: water.amount, id: water._id }))
  const allAmountForDay = filteredWaters.reduce((acc, water)=> acc += water.amount, 0)
  
  return res.json({
      day,
      month: months[Number(month) - 1],
      year,
      waterRateForThisDay: allWater[0].waterRateForThisDay,
      allAmountForDay,
      percentageWater: `${(allAmountForDay / (allWater[0].waterRateForThisDay / 100)).toFixed(2)}%`,
      portionsOfWater: filteredWaters
    })
};

export const getWaterInfoPerMonthController = async (req, res) => {
  const { id } = req.user;
  const { date } = req.body;
  let sep;
  if (date.includes("/")) sep = "/";
  else if (date.includes("-")) sep = "-";
  const [month, year] = date.split(sep);
  const mo = months[Number(month) - 1];

  const allWater = await Water.find({ owner: id, month: months[Number(month) - 1], year });

  if (allWater.length === 0) {
    return res.status(200).json({
      month: mo,
      year,
      waterForMonth: allWater
    });
  }
  // let waterForMonth = [];
  // while (allWater.length > 0) {
  //   const firstDay = allWater[0].day
  //   const dataForOneDay = allWater.filter(water => water.day === firstDay);
  //   // const dataAboutOneDay = {
  //   //   "date": ,
  //   //   "year" ,
  //   //   "totalWaterForDay" ,
  
  //   // }
  //   allWater.filter(water => water.day !== firstDay)
  // }
  // console.log(dataForOneDay)
  

  // watersForDay.forEach((forDay) => {
  //   if (forDay.month === mo) {
  //     const numberOfZeros = forDay.waterRateForThisDay
  //       .toString()
  //       .split("")
  //       .filter((char) => char === "0").length;

  //     waters.filter((el) => {
  //       console.log(el.day);
  //     });

  //     const infoPerMonth = {
  //       totalWaterForDay: waters.filter(
  //         (portion) =>
  //           mo === portion.month &&
  //           year === portion.year &&
  //           forDay.day === portion.day
  //       ).length,
  //       date: `${forDay.day[0] === "0" ? forDay.day.slice(1) : forDay.day}, ${
  //         forDay.month
  //       }`,
  //       dailyNorm:
  //         numberOfZeros > 1
  //           ? (Number(forDay.waterRateForThisDay) / 1000).toFixed(1) + " L"
  //           : (Number(forDay.waterRateForThisDay) / 1000).toFixed(2) + " L",
  //       percentageWater:
  //         (
  //           (Number(forDay.allAmountForDay) /
  //             Number(forDay.waterRateForThisDay)) *
  //           100
  //         ).toFixed(2) + " %",
  //     };
  //     waterForMonth.push(infoPerMonth);
  //   }
  // });

  
};
