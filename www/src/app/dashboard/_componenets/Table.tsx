import { useEffect, useState, useMemo } from "react";
import {
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconSelector,
} from "@tabler/icons-react";
import {
  Anchor,
  Center,
  Group,
  keys,
  Progress,
  ScrollArea,
  Box,
  Table,
  Text,
  TextInput,
  UnstyledButton,
  Pagination,
  LoadingOverlay,
} from "@mantine/core";
import classes from "./Table.module.css";
import autoApplyAPI from "../../../../lib/api/classes/autoApplyAPI";
import { AutoApply } from "../../../entity";
import { RootState } from "../../../store";
import { useSelector } from "react-redux";
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
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
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
      if (typeof value === "string") {
        return value.toLowerCase().includes(query);
      }
      if (typeof value === "number") {
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

      if (typeof a[sortBy] === "string" && typeof b[sortBy] === "string") {
        result = a[sortBy].localeCompare(b[sortBy]);
      } else if (
        typeof a[sortBy] === "number" &&
        typeof b[sortBy] === "number"
      ) {
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

const fakeData = [
  {
    title: "Web Developer",
    company: "Spectrum",
    date: "March 3, 2024",
    skillMatch: 0.7,
  },
  {
    title: "Developer",
    company: "Dish",
    date: "March 3, 2024",
    skillMatch: 0.9,
  },
  {
    title: "App Developer",
    company: "Spectrum",
    date: "March 3, 2024",
    skillMatch: 0.25,
  },
  {
    title: "Frontend Developer",
    company: "Tech Solutions",
    date: "April 15, 2024",
    skillMatch: 0.85,
  },
  {
    title: "Backend Developer",
    company: "TechCorp",
    date: "May 5, 2024",
    skillMatch: 0.95,
  },
  {
    title: "Software Engineer",
    company: "InnoTech",
    date: "June 20, 2024",
    skillMatch: 0.65,
  },
  {
    title: "Mobile Developer",
    company: "MobiTech",
    date: "July 1, 2024",
    skillMatch: 0.55,
  },
  {
    title: "Full Stack Developer",
    company: "CloudTech",
    date: "August 10, 2024",
    skillMatch: 0.75,
  },
  {
    title: "Data Scientist",
    company: "DataWorks",
    date: "September 12, 2024",
    skillMatch: 0.8,
  },
  {
    title: "DevOps Engineer",
    company: "NetOps",
    date: "October 25, 2024",
    skillMatch: 0.6,
  },
];

export function ApplicationTable() {
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState<RowData[]>(fakeData);
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [total, setTotal] = useState(10);
  const [page, setPage] = useState(1);

  const [autoApplyData, setAutoApplyData] = useState<AutoApply[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userInfo = useSelector((state: RootState) => state.user);

  const pageSize = 10;

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError(null);

      const api = new autoApplyAPI();
      const payload = {
        page,
        pageSize,
        orderBy: "listing.title",
        orderDirection: "ASC" as "ASC" | "DESC",
        filters: { status: "active" },
      };

      const response = await api.getApplications(payload);

      console.log(response);

      if (response && response.autoApply && response.autoApply.length) {
        console.log("test");
        const transformedData = response.autoApply.map(
          (autoApply: AutoApply) => ({
            title: autoApply.listing.title,
            company: autoApply.listing.company,
            date: new Date(autoApply.dateApplied).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            skillMatch: Math.random(),
          })
        );

        setSortedData(transformedData);
        setTotal(response.pagination.total);
      } else {
        setError("Failed to fetch auto-apply records.");
      }

      setLoading(false);
    };

    fetchApplications();
  }, [page]);

  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
  };

  const rows = sortedData.map((row) => {
    return (
      <Table.Tr key={row.title}>
        <Table.Td>
          <Anchor component="button" fz="sm" lineClamp={1} truncate={"end"}>
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
              {Math.floor(row.skillMatch * 100)}%
            </Text>
            <Text fz="xs" c="red" fw={700}>
              {Math.floor(100 - row.skillMatch * 100)}%
            </Text>
          </Group>
          <Progress.Root>
            <Progress.Section
              className={classes.progressSection}
              value={row.skillMatch * 100}
              color="teal"
            />

            <Progress.Section
              className={classes.progressSection}
              value={100 - row.skillMatch * 100}
              color="red"
            />
          </Progress.Root>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Box
      style={{
        marginBottom: "50px",
      }}
    >
      <TextInput
        placeholder="Search by any field"
        mb="md"
        leftSection={<IconSearch size={16} stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
      />

      <Table.ScrollContainer
        style={{
          marginBottom: "50px",
        }}
        minWidth={1400}
      >
        <LoadingOverlay
          visible={userInfo.loading || loading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
          loaderProps={{ color: "blue", type: "bars" }}
        />
        <Table
          horizontalSpacing="md"
          verticalSpacing="xs"
          miw={700}
          layout="fixed"
        >
          <Table.Tbody>
            <Table.Tr>
              <Th
                sorted={sortBy === "title"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("title")}
              >
                Position
              </Th>
              <Th
                sorted={sortBy === "company"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("company")}
              >
                Company
              </Th>
              <Table.Th>Resume Used</Table.Th>
              <Th
                sorted={sortBy === "date"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("date")}
              >
                Date Applied
              </Th>
              <Th
                sorted={sortBy === "skillMatch"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("skillMatch")}
              >
                Skillset Match
              </Th>
            </Table.Tr>
          </Table.Tbody>
          <Table.Tbody>
            {sortedData.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td
                  colSpan={
                    sortedData.length > 0
                      ? Object.keys(sortedData[0]).length
                      : 1
                  }
                >
                  <Text fw={500} ta="center">
                    Nothing found
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      <Box
        style={{
          display: "flex",
          justifyContent: "center", // Centers horizontally
          marginTop: "50px",
        }}
      >
        <Pagination
          total={Math.ceil(total / pageSize)}
          onChange={(page) => setPage(page)}
        />
      </Box>
    </Box>
  );
}
