export function fakeArray(length = 5) {
  const fakeArray = [];

  for (let i = 0; i < length; i++) {
    fakeArray.push({
      id: i + 1,
      name: `Item ${i + 1}`,
      description: `This is a fake description for item ${i + 1}`,
      price: (Math.random() * 100).toFixed(2),
    });
  }

  return fakeArray;
}
