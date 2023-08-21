export const generateRandomNumber = (min: number, max: number) => Math.random() * (max - min + 1) + min
export const generateRandomSign = () => Math.random() < 0.5 ? -1 : 1