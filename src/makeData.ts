import { faker } from '@faker-js/faker';

export type ItemSummary = {
  description: string;
  coverType: string;
  sumInsured: string;
  excess: string;
  address: string;
};

const range = (len: number) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newPerson = (): ItemSummary => {
  return {
    description: faker.vehicle.vehicle(),
    coverType: 'Present Day Value',
    sumInsured: String(faker.datatype.number(10000)),
    excess: String(faker.datatype.number(1000)),
    address: pickRandomValueFromArray(['203 Prince Manors Suite 130', '822 Roob Lights Suite 468', '2743 Considine Spring Apt. 823']),
  };
};

function pickRandomValueFromArray<T>(arr: T[]): T {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

export function makeData(...lens: number[]) {
  const makeDataLevel = (depth = 0): ItemSummary[] => {
    const len = lens[depth]!;
    return range(len).map((d): ItemSummary => {
      return {
        ...newPerson(),
      };
    });
  };

  return makeDataLevel();
}
