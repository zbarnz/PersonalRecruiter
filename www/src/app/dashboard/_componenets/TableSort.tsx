import { useEffect, useState } from 'react';
import { IconChevronDown, IconChevronUp, IconSearch, IconSelector } from '@tabler/icons-react';
import {
  Anchor,
  Center,
  Group,
  keys,
  Progress,
  ScrollArea,
  Table,
  Text,
  TextInput,
  UnstyledButton,
} from '@mantine/core';
import classes from './TableSort.module.css';
import autoApplyAPI from '../../../../lib/api/classes/autoApplyAPI';
interface RowData {
  title: string;
  company: string;
  date: string;
  skillMatch: number;
}

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort: () => void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  return (
    <Table.Th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size={16} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

function filterData(data: RowData[], search: string) {
  const query = search.toLowerCase().trim();
  
  return data.filter((item) =>
    keys(data[0]).some((key) => {
      const value = item[key];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(query);
      }
      if (typeof value === 'number') {
        return value.toString().includes(query);
      }
      return false; // For unsupported data types
    })
  );
}


function sortData(
  data: RowData[],
  payload: { sortBy: keyof RowData | null; reversed: boolean; search: string }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      let result = 0;

      if (typeof a[sortBy] === 'string' && typeof b[sortBy] === 'string') {
        result = a[sortBy].localeCompare(b[sortBy]);
      } else if (typeof a[sortBy] === 'number' && typeof b[sortBy] === 'number') {
        result = a[sortBy] - b[sortBy];
      } else if (isDate(a[sortBy]) && isDate(b[sortBy])) {
        // Now we safely assume both a[sortBy] and b[sortBy] are Date objects
        result = a[sortBy].getTime() - b[sortBy].getTime();
      }

      return payload.reversed ? -result : result;
    }),
    payload.search
  );
}

// Type guard to check if a value is a Date
function isDate(value: any): value is Date {
  return value instanceof Date;
}



const data = [
  {
    title: 'Web Developer',
    company: 'Spectrum',
    date: 'March 3, 2024',
    skillMatch: 0.7,
  },
  {
    title: 'Developer',
    company: 'Dish',
    date: 'March 3, 2024',
    skillMatch: 0.9,
  },
  {
    title: 'App Developer',
    company: 'Spectrum',
    date: 'March 3, 2024',
    skillMatch: 0.25,
  },
  {
    title: 'Frontend Developer',
    company: 'Tech Solutions',
    date: 'April 15, 2024',
    skillMatch: 0.85,
  },
  {
    title: 'Backend Developer',
    company: 'TechCorp',
    date: 'May 5, 2024',
    skillMatch: 0.95,
  },
  {
    title: 'Software Engineer',
    company: 'InnoTech',
    date: 'June 20, 2024',
    skillMatch: 0.65,
  },
  {
    title: 'Mobile Developer',
    company: 'MobiTech',
    date: 'July 1, 2024',
    skillMatch: 0.55,
  },
  {
    title: 'Full Stack Developer',
    company: 'CloudTech',
    date: 'August 10, 2024',
    skillMatch: 0.75,
  },
  {
    title: 'Data Scientist',
    company: 'DataWorks',
    date: 'September 12, 2024',
    skillMatch: 0.80,
  },
  {
    title: 'DevOps Engineer',
    company: 'NetOps',
    date: 'October 25, 2024',
    skillMatch: 0.6,
  },
];


export function TableSort() {
  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const [autoApplyData, setAutoApplyData] = useState<AutoApply[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError(null);

      const api = new autoApplyAPI(); // Create an instance of autoApplyAPI
      const payload = {
        page: 1,
        pageSize: 10,
        orderBy: "title", // Example order by field
        orderDirection: "ASC", // Example order direction
        filters: { status: "active" }, // Example filter
      };

      const response = await api.getApplications(payload);

      if (response) {
        setSortedData(response.autoApply);
      } else {
        setError("Failed to fetch auto-apply records.");
      }

      setLoading(false);
    };

    fetchApplications();
  }, []);


  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search: value }));
  };

  const rows = sortedData.map((row) => {


    return (
      <Table.Tr key={row.title}>
        <Table.Td>
          <Anchor component="button" fz="sm">
            {row.title}
          </Anchor>
        </Table.Td>
        <Table.Td>
          <Anchor component="button" fz="sm">
            {row.company}
          </Anchor>
        </Table.Td>
        <Table.Td>
          <Anchor component="button" fz="sm">
            Resume
          </Anchor>
        </Table.Td>
        <Table.Td>{row.date}</Table.Td>
        <Table.Td>
          <Group justify="space-between">
            <Text fz="xs" c="teal" fw={700}>
              {Math.floor(row.skillMatch*100)}%
            </Text>
            <Text fz="xs" c="red" fw={700}>
              {Math.floor(100 - row.skillMatch*100)}%
            </Text>
          </Group>
          <Progress.Root>
            <Progress.Section
              className={classes.progressSection}
              value={row.skillMatch*100}
              color="teal"
            />

            <Progress.Section
              className={classes.progressSection}
              value={100-row.skillMatch*100}
              color="red"
            />
          </Progress.Root>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <ScrollArea>
      <TextInput
        placeholder="Search by any field"
        mb="md"
        leftSection={<IconSearch size={16} stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
      />
      <Table horizontalSpacing="md" verticalSpacing="xs" miw={700} layout="fixed">
        <Table.Tbody>
          <Table.Tr>
            <Th
              sorted={sortBy === 'title'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('title')}
            >
              Position
            </Th>
            <Th
              sorted={sortBy === 'company'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('company')}
            >
              Company
            </Th>
            <Table.Th>Resume Used</Table.Th>
            <Th
              sorted={sortBy === 'date'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('date')}
            >
              Date Applied
            </Th>
            <Th
              sorted={sortBy === 'skillMatch'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('skillMatch')}
            >
              Skillset Match
            </Th>
          </Table.Tr>
        </Table.Tbody>
        <Table.Tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            <Table.Tr>
              <Table.Td colSpan={Object.keys(data[0]).length}>
                <Text fw={500} ta="center">
                  Nothing found
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}