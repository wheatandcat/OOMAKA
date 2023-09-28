import dayjs from "~/utils/dayjs";

export const emojiList = [
  ["🎍", "⛩️", "🎌", "🌅", "🍱", "🦐", "🍣", "🗻"],
  ["👹", "❤️", "🍫", "💖", "💝"],
  ["🎎", "🍬", "🍭", "🧑‍🎓", "👩‍🎓"],
  ["🌸", "☘️", "🐣", "💐", "🌷"],
  ["🎏", "🍀", "👶", "🌹", "🪻"],
  ["☔️", "⚡️", "🐌", "🪷"],
  ["🎋", "🌠", "🎐", "🐚", "🌊"],
  ["🎆", "🌻", "🌞", "🐳", "🐬", "🍉"],
  ["🎑", "🍁", "🍂", "🐞"],
  ["😈", "🎃", "💀", "👻"],
  ["🐈", "🚀", "🐕", "✌️", "💎"],
  ["🎄", "⭐️", "🍪", "🌟", "🎅", "🎁"],
];

export const getEmoji = (date: dayjs.Dayjs) => {
  const month = Number(dayjs(date).format("M")) - 1;
  const items = emojiList[month] ?? [];
  const index = Math.floor(Math.random() * items.length);
  return items[index] ?? "";
};
