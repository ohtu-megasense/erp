import { FormEvent, useState } from 'react';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useAddItemMutation } from '../../../features/apiSlice';
import { Category } from '../../../../../shared/types';

interface AddCategoryItemFormProps {
  category: Category;
}

export const AddCategoryItemForm = ({ category }: AddCategoryItemFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string | number>>(
    {}
  );
  const [addItem] = useAddItemMutation();
  const shapeKeys = Object.keys(category.itemShape);

  const handleInputChange = (key: string, value: string): void => {
    const type = category.itemShape[key];

    if (type === 'FLOAT') {
      // Salli vain numerot, piste ja pilkku
      const valid = /^[0-9]*[.,]?[0-9]*$/.test(value);
      if (!valid) return; // älä päivitä tilaa

      setFormValues((prev) => ({
        ...prev,
        [key]: value
      }));
      return;
    }

    if (type === 'INTEGER') {
      // Salli vain kokonaisluvut
      const valid = /^[0-9]*$/.test(value);
      if (!valid) return;

      setFormValues((prev) => ({
        ...prev,
        [key]: value
      }));
      return;
    }

    // TEXT tai muu
    setFormValues((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  /* BROKEN
  * const validateInputs = (key: string | number): boolean => {
		const type = category.itemShape[key]; // "TEXT", "INTEGER", "FLOAT"
		const value = formValues[key] ?? "";

		const actualType = typeof value;

		console.log(type, actualType, value);
		if (
			(type === "TEXT" && actualType !== "string") ||
			(type === "INTEGER" && actualType !== "number") ||
			(type === "FLOAT" && actualType !== "number")
		) {
			setError("Please enter value with valid type");
			return false;
		}

		return true;
	};
*/
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const newItem = shapeKeys.reduce(
      (acc, key) => {
        /*if (!validateInputs(key)) {
					return;
				}*/
        const raw = formValues[key] ?? '';
        const type = category.itemShape[key];

        switch (type) {
          case 'INTEGER':
            acc[key] = parseInt(String(raw), 10);
            break;
          case 'FLOAT':
            acc[key] = parseFloat(String(raw).replace(',', '.'));
            break;
          case 'TEXT':
          default:
            acc[key] = raw;
            break;
        }
        return acc;
      },
      {} as Record<string, string | number>
    );
    try {
      console.log('item', newItem);
      await addItem({
        id: category.id,
        item_data: newItem
      }).unwrap();

      setError(null);
    } catch (error) {
      console.log('error: ', error);
    }
    //		dispatch(
    //		addedItem({
    //		categoryId: category.id,
    //	item: newItem,
    //	}),
    //	);

    setFormValues({});
  };

  return (
    <Box>
      <Typography variant="subtitle2" mb={1} sx={{ fontSize: '0.8125rem' }}>
        Add Item to {category.name}
      </Typography>
      {shapeKeys.length === 0 ? (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontSize: '0.8125rem' }}
        >
          No shape defined for this category yet
        </Typography>
      ) : (
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 0 }}>
          <Stack spacing={1}>
            {shapeKeys.map((key) => (
              <TextField
                key={key}
                label={key + ' ' + category.itemShape[key]}
                error={!!error}
                helperText={error || ''}
                value={formValues[key] || ''}
                onChange={(e) => handleInputChange(key, e.target.value)}
                variant="outlined"
                size="small"
                fullWidth
                sx={{
                  '& .MuiInputBase-root': {
                    height: '28px',
                    fontSize: '0.8125rem'
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.8125rem',
                    transform: 'translate(14px, 6px) scale(1)',
                    '&.MuiInputLabel-shrink': {
                      transform: 'translate(14px, -6px) scale(0.75)'
                    }
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderWidth: '1px'
                  }
                }}
              />
            ))}
            <Box>
              <Button
                type="submit"
                variant="outlined"
                color="primary"
                size="small"
                sx={{ py: 0.5, fontSize: '0.8125rem' }}
              >
                + Add
              </Button>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
};
