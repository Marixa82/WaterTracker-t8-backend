import { HttpError, dateSeparator } from "../helpers/index.js";
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

  const [day, month, year] = dateSeparator(date);

  await Water.updateMany(
    { owner: id, day, month: months[Number(month) - 1], year },
    { waterRateForThisDay: waterRate }
  );
  await User.findByIdAndUpdate(id, { waterRate }, { new: true });

  res.status(200).json({
    message: "Water Rate was changed successful",
  });
};

export const addWaterController = async (req, res) => {
  const { id } = req.user;
  const { date, time, waterAmount } = req.body;
  const { waterRate } = await User.findById(id);

  const [day, month, year] = dateSeparator(date);

  const waterData = {
    day,
    month: months[Number(month) - 1],
    year,
    time,
    amount: waterAmount,
    waterRateForThisDay: waterRate,
    owner: id,
  };

  const waterPortion = await Water.create(waterData);

  return res.json({
    message: "New water portion is added successful",
    waterData: {
      day: waterPortion.day,
      month: waterPortion.month,
      year: waterPortion.year,
      time: waterPortion.time,
      amount: waterPortion.amount,
      id: waterPortion._id,
    },
  });
};

export const deleteWaterController = async (req, res) => {
  const { id } = req.user;
  const { id: waterId } = req.params;

  const waterPortion = await Water.findOneAndDelete({
    _id: waterId,
    owner: id,
  });

  if (!waterPortion)
    throw HttpError(404, `There are no portions with id ${waterId}`);

  return res.status(204).json();
};

export const updateWaterController = async (req, res) => {
  const { id } = req.user;
  const { id: waterId } = req.params;
  const { time, waterAmount } = req.body;

  const waterPortion = await Water.findOne({ _id: waterId, owner: id });
  if (!waterPortion)
    throw HttpError(404, `There are no portions with id ${waterId}`);

  if (!time && !waterAmount) throw HttpError(400, "Must be at least one field");

  const newPortion = await Water.findByIdAndUpdate(
    waterId,
    {
      time: time ?? waterPortion.time,
      amount: waterAmount ?? waterPortion.amount,
    },
    { new: true }
  );

  return res.json({
    message: "Water portion is updated successful",
    waterData: {
      day: newPortion.day,
      month: newPortion.month,
      year: newPortion.year,
      time: newPortion.time,
      amount: newPortion.amount,
      id: newPortion._id,
    },
  });
};

export const getWaterInfoTodayController = async (req, res) => {
  const { id } = req.user;
  const { date } = req.query;
  if (!date) throw HttpError(400, "date is required in query params");
  if (
    !date.match(/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/)
  )
    throw HttpError(400, "date must be in format DD/MM/YYYY or DD-MM-YYYY");
  const [day, month, year] = dateSeparator(date);

  const allWater = await Water.find({
    owner: id,
    day,
    month: months[Number(month) - 1],
    year,
  });

  if (allWater.length === 0) {
    return res.json({
      day,
      month: months[Number(month) - 1],
      year,
      portionsOfWater: allWater,
    });
  }

  const filteredWaters = allWater.map((water) => ({
    time: water.time,
    amount: water.amount,
    id: water._id,
  }));
  const allAmountForDay = filteredWaters.reduce(
    (acc, water) => (acc += water.amount),
    0
  );

  return res.json({
    day,
    month: months[Number(month) - 1],
    year,
    waterRateForThisDay: allWater[0].waterRateForThisDay,
    allAmountForDay,
    percentageWater: `${(
      allAmountForDay /
      (allWater[0].waterRateForThisDay / 100)
    ).toFixed(2)}%`,
    portionsOfWater: filteredWaters,
  });
};

export const getWaterInfoPerMonthController = async (req, res) => {
  const { id } = req.user;
  const { date } = req.query;
  if (!date) throw HttpError(400, "date is required in query params");
  if (!date.match(/^(0?[1-9]|1[012])[\/\-]\d{4}$/))
    throw HttpError(400, "date must be in format MM/YYYY or MM-YYYY");
  const [month, year] = dateSeparator(date);
  const monthString = months[Number(month) - 1];

  const allWater = await Water.find({ owner: id, month: monthString, year });

  if (allWater.length === 0) {
    return res.status(200).json({
      month: monthString,
      year,
      waterForMonth: allWater,
    });
  }
  let waterForMonth = [];
  allWater.forEach((water) => {
    if (
      waterForMonth.some(
        (waterForMonthData) =>
          waterForMonthData.date ===
          `${water.day[0] === "0" ? water.day.slice(1) : water.day}, ${
            water.month
          }`
      )
    )
      return;
    const dataForOneDay = allWater.filter((data) => data.day === water.day);
    const allAmountForDay = dataForOneDay.reduce(
      (acc, dataWater) => (acc += dataWater.amount),
      0
    );
    const dataAboutOneDay = {
      date: `${water.day[0] === "0" ? water.day.slice(1) : water.day}, ${
        water.month
      }`,
      year: water.year,
      totalWaterPortionsForDay: dataForOneDay.length,
      dailyNorm: `${(water.waterRateForThisDay / 1000).toFixed(2)} L`,
      percentageWater: `${(
        allAmountForDay /
        (water.waterRateForThisDay / 100)
      ).toFixed(2)}%`,
    };
    waterForMonth.push(dataAboutOneDay);
  });

  return res.status(200).json({
    month: monthString,
    year,
    waterForMonth,
  });
};
