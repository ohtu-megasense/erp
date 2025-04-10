interface Dataset {
  label: string;
  shape: Record<string, string>;
  dataset: DatasetItem[];
}

interface DatasetItem {
  [key: string]: string | number;
}

const isDataSetElementType = (obj: unknown): obj is string | number => {
  return typeof obj === 'string' || typeof obj === 'number';
};

export const validateDataset = (
  dataset: unknown,
  xAxisField: string,
  yAxisField: string
): { isValid: boolean; error?: string } => {
  if (!Array.isArray(dataset)) {
    return { isValid: false, error: 'Dataset must be an array' };
  }
  if (dataset.length === 0) {
    return { isValid: false, error: 'Dataset is empty' };
  }
  for (const [index, item] of dataset.entries()) {
    if (typeof item !== 'object' || item === null) {
      return {
        isValid: false,
        error: `Item at index ${index} is not an object`
      };
    }
    if (!(xAxisField in item)) {
      return {
        isValid: false,
        error: `Item at index ${index} is missing xAxisField: ${xAxisField}`
      };
    }
    if (!isDataSetElementType(item[xAxisField])) {
      return {
        isValid: false,
        error: `xAxisField value at index ${index} must be a string or number`
      };
    }
    if (!(yAxisField in item)) {
      return {
        isValid: false,
        error: `Item at index ${index} is missing yAxisField: ${yAxisField}`
      };
    }
    if (typeof item[yAxisField] !== 'number' || isNaN(item[yAxisField])) {
      return {
        isValid: false,
        error: `yAxisField value at index ${index} must be a valid number`
      };
    }
  }
  return { isValid: true };
};

export const groupAndSumByProperty = ({
  data,
  groupByKey,
  sumByKey
}: {
  data: Record<string, number>[];
  groupByKey: string;
  sumByKey: string;
}) => {
  const result: Record<string, number> = {};

  for (const item of data) {
    if (!(item[groupByKey] in result)) {
      result[item[groupByKey]] = 0;
    }

    result[item[groupByKey]] += item[sumByKey];
  }

  return Object.entries(result).map(([key, value]) => ({
    key,
    value
  }));
};

// already processed dataset where
// each entry represents total value
// for single contactId
// -> summarized/aggregated type dataset
// y by x -> total value by contactId

export const testDataset: Dataset = {
  label: 'Customer Transaction Summary Q1 2025',
  shape: {
    contactId: 'string',
    value: 'number',
    region: 'string',
    transactionCount: 'number',
    customerType: 'string'
  },
  dataset: [
    {
      contactId: 'CUST001-A',
      value: 14582,
      region: 'North America',
      transactionCount: 45,
      customerType: 'Enterprise'
    },
    {
      contactId: 'CUST002-B',
      value: 3721,
      region: 'Europe',
      transactionCount: 18,
      customerType: 'Small Business'
    },
    {
      contactId: 'CUST003-C',
      value: 89234,
      region: 'Asia-Pacific',
      transactionCount: 127,
      customerType: 'Enterprise'
    },
    {
      contactId: 'CUST004-D',
      value: 456,
      region: 'South America',
      transactionCount: 3,
      customerType: 'Individual'
    },
    {
      contactId: 'CUST005-E',
      value: 27891,
      region: 'North America',
      transactionCount: 62,
      customerType: 'Mid-Tier'
    },
    {
      contactId: 'CUST006-F',
      value: 1023,
      region: 'Europe',
      transactionCount: 9,
      customerType: 'Individual'
    },
    {
      contactId: 'CUST007-G',
      value: 65328,
      region: 'Asia-Pacific',
      transactionCount: 89,
      customerType: 'Enterprise'
    },
    {
      contactId: 'CUST008-H',
      value: 987,
      region: 'South America',
      transactionCount: 5,
      customerType: 'Small Business'
    },
    {
      contactId: 'CUST009-I',
      value: 41256,
      region: 'North America',
      transactionCount: 73,
      customerType: 'Mid-Tier'
    },
    {
      contactId: 'CUST010-J',
      value: 19345,
      region: 'Europe',
      transactionCount: 34,
      customerType: 'Mid-Tier'
    }
  ]
};
