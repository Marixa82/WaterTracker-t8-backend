import { HttpError } from "../helpers/index.js";
import { User } from "../models/userModel.js";

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
  const { waterRate } = req.body;
  const { id } = req.user;

  await User.findByIdAndUpdate(id, { waterRate });
  res.status(200).json({
    message: "Water Rate was changed successful",
  });
};

export const addWaterController = async (req, res) => {
  const { id } = req.user;
  const { date, time, waterAmount } = req.body;
  const { waterRate, watersForDay } = await User.findById(id);

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
  };

  await User.findByIdAndUpdate(
    id,
    { $push: { waters: waterData } },
    { new: true }
  );
  const findDay = watersForDay.find(
    (water) =>
      water.year === year &&
      water.month === months[Number(month) - 1] &&
      water.day === day
  );
  if (!findDay) {
    const dataAboutDay = {
      day,
      month: months[Number(month) - 1],
      year,
      waterRateForThisDay: waterRate,
      allAmountForDay: waterAmount,
    };
    await User.findByIdAndUpdate(
      id,
      { $push: { watersForDay: dataAboutDay } },
      { new: true }
    );
  } else {
    findDay.allAmountForDay = findDay.allAmountForDay + waterAmount;

    await User.findByIdAndUpdate(
      id,
      { $pull: { watersForDay: { _id: findDay._id } } },
      { new: true }
    );
    await User.findByIdAndUpdate(
      id,
      { $push: { watersForDay: { ...findDay } } },
      { new: true }
    );
  }

  return res.json({
    message: "New water portion is added successful",
    waterData,
  });
};

export const deleteWaterController = async (req, res) => {
  const { id } = req.user;
  const { id: waterId } = req.params;
  const { waters, watersForDay } = await User.findById(id);
  const waterPortion = waters.find((water) => water._id.toString() === waterId);
  if (!waterPortion)
    throw HttpError(404, `There are no portions with id ${waterId}`);

  await User.findByIdAndUpdate(
    id,
    { $pull: { waters: { _id: waterId } } },
    { new: true }
  );
  const findDay = watersForDay.find(
    (water) =>
      water.year === waterPortion.year &&
      water.month === waterPortion.month &&
      water.day === waterPortion.day
  );
  if (findDay) {
    findDay.allAmountForDay = findDay.allAmountForDay - waterPortion.amount;

    await User.findByIdAndUpdate(
      id,
      { $pull: { watersForDay: { _id: findDay._id } } },
      { new: true }
    );
    await User.findByIdAndUpdate(
      id,
      { $push: { watersForDay: { ...findDay } } },
      { new: true }
    );
  }

  return res.status(204).json();
};

export const updateWaterController = async (req, res) => {
  const { id } = req.user;
  const { id: waterId } = req.params;
  const { time, waterAmount } = req.body;
  const { waters, watersForDay } = await User.findById(id);
  const waterPortion = waters.find((water) => water._id.toString() === waterId);

  if (!waterPortion)
    throw HttpError(404, `There are no portions with id ${waterId}`);

  if (!time && !waterAmount) throw HttpError(400, "Must be at least one field");
  if (time) waterPortion.time = time;
  if (waterAmount) {
    const findDay = watersForDay.find(
      (water) =>
        water.year === waterPortion.year &&
        water.month === waterPortion.month &&
        water.day === waterPortion.day
    );
    if (findDay) {
      findDay.allAmountForDay =
        findDay.allAmountForDay + waterAmount - waterPortion.amount;
      await User.findByIdAndUpdate(
        id,
        { $pull: { watersForDay: { _id: findDay._id } } },
        { new: true }
      );
      await User.findByIdAndUpdate(
        id,
        { $push: { watersForDay: { ...findDay } } },
        { new: true }
      );
    }
    waterPortion.amount = waterAmount;
  }

  await User.findByIdAndUpdate(
    id,
    { $pull: { waters: { _id: waterId } } },
    { new: true }
  );
  await User.findByIdAndUpdate(
    id,
    { $push: { waters: { ...waterPortion } } },
    { new: true }
  );

  return res.json({
    message: "Water portion is updated successful",
    waterPortion,
  });
};

export const getWaterInfoTodayController = async (req, res) => {
  const { id } = req.user;
  const { date } = req.body;
  let sep;
  if (date.includes("/")) sep = "/";
  else if (date.includes("-")) sep = "-";
  const [day, month, year] = date.split(sep);
  const { waters, watersForDay } = await User.findById(id);
  const portionsOfWater = waters
    .filter(
      (water) =>
        water.day === day &&
        water.month === months[Number(month) - 1] &&
        water.year === year
    )
    .map((water) => ({
      time: water.time,
      amount: water.amount,
      id: water._id,
    }));
  const findDay = watersForDay.find(
    (water) =>
      water.year === year &&
      water.month === months[Number(month) - 1] &&
      water.day === day
  );
  if (portionsOfWater.length !== 0 && findDay) {
    return res.json({
      day,
      month: months[Number(month) - 1],
      year,
      waterRateForThisDay: findDay.waterRateForThisDay,
      allAmountForDay: findDay.allAmountForDay,
      perc: `${(
        findDay.allAmountForDay /
        (findDay.waterRateForThisDay / 100)
      ).toFixed(2)}%`,
      portionsOfWater,
    });
  }

  return res.json({
    day,
    month: months[Number(month) - 1],
    year,
    portionsOfWater,
  });
};

export const getWaterInfoPerMonthController = async (req, res) => {
  const { id } = req.user;
  const { date } = req.body;
  let sep;
  if (date.includes("/")) sep = "/";
  else if (date.includes("-")) sep = "-";
  const [month, year] = date.split(sep);
  const mo = months[Number(month) - 1];

  const { watersForDay, waters } = await User.findById(id);

  let waterForMonth = [];

  watersForDay.forEach((forDay) => {
    if (forDay.month === mo) {
      const numberOfZeros = forDay.waterRateForThisDay
        .toString()
        .split("")
        .filter((char) => char === "0").length;

      waters.filter((el) => {
        console.log(el.day);
      });

      const infoPerMonth = {
        totalWaterForDay: waters.filter(
          (portion) =>
            mo === portion.month &&
            year === portion.year &&
            forDay.day === portion.day
        ).length,
        date: `${forDay.day[0] === "0" ? forDay.day.slice(1) : forDay.day}, ${
          forDay.month
        }`,
        dailyNorm:
          numberOfZeros > 1
            ? (Number(forDay.waterRateForThisDay) / 1000).toFixed(1) + " L"
            : (Number(forDay.waterRateForThisDay) / 1000).toFixed(2) + " L",
        percentageWater:
          (
            (Number(forDay.allAmountForDay) /
              Number(forDay.waterRateForThisDay)) *
            100
          ).toFixed(1) + " %",
      };
      waterForMonth.push(infoPerMonth);
    }
  });

  return res.status(200).json({
    month: mo,
    year,
    waterForMonth,
  });
};
