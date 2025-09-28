// components/EarningsTable/EarningsTable.js
import { useState, useMemo } from "react";
import {
  Table,
  ScrollArea,
  TextInput,
  Group,
  ActionIcon,
  Button,
  Text,
  Switch,
  Paper,
  Box,
  Tooltip,
} from "@mantine/core";
import {
  IconSearch,
  IconTrash,
  IconArrowUp,
  IconArrowDown,
  IconAnalyze,
} from "@tabler/icons-react";
import TableControls from "./TableControls";
import {
  columnDefinitions,
  formatValue,
  defaultVisibleColumns,
} from "../../utils/tableConfig";
import {
  handleFetchComplexFields
} from '../../utils/field_manipulation.js'
import {
  sortFields
} from '../../utils/earnings_table_util_functions.js'

const EarningsTable = ({ companies, onDeleteCompany }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleColumns, setVisibleColumns] = useState(defaultVisibleColumns);
  const [showAnalysts, setShowAnalysts] = useState(false);
  const [rowAnalystState, setRowAnalystState] = useState({});
  const [columnOrder, setColumnOrder] = useState([...defaultVisibleColumns]);
  const [draggedColumn, setDraggedColumn] = useState(null);
  const [sortOrder, setOrder] = useState(null); // 'asc', 'desc', or null
  const [sortColumn, setSortColumn] = useState(null); // column key

  // Handle sorting logic
  const handleSort = (e, columnKey) => {
    e.preventDefault();
    if (sortColumn === columnKey) {
      // Cycle through desc -> asc -> null
      if (sortOrder === "desc") {
        setOrder("asc");
      } else if (sortOrder === "asc") {
        setOrder(null);
        setSortColumn(null);
      }
    } else {
      setSortColumn(columnKey);
      setOrder("desc");
    }
  };

  // Reset column order to default
  const resetColumnOrder = () => {
    setColumnOrder([...defaultVisibleColumns]);
  };

  const toggleColumn = (columnKey) => {
    setVisibleColumns((prev) => {
      if (prev.includes(columnKey)) {
        // Remove from visible columns
        const newVisible = prev.filter((col) => col !== columnKey);
        // Also remove from column order
        setColumnOrder((prevOrder) =>
          prevOrder.filter((col) => col !== columnKey)
        );
        return newVisible;
      } else {
        // Add to visible columns and column order
        const newVisible = [...prev, columnKey];
        setColumnOrder((prevOrder) => {
          // Add to end of order if not already there
          if (!prevOrder.includes(columnKey)) {
            return [...prevOrder, columnKey];
          }
          return prevOrder;
        });
        return newVisible;
      }
    });
  };

  // Handle drag start
  const handleDragStart = (e, columnKey) => {
    setDraggedColumn(columnKey);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", columnKey);
  };

  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  // Handle drop
  const handleDrop = (e, targetColumnKey) => {
    e.preventDefault();

    if (!draggedColumn || draggedColumn === targetColumnKey) {
      setDraggedColumn(null);
      return;
    }

    setColumnOrder((prev) => {
      const newOrder = [...prev];
      const draggedIndex = newOrder.indexOf(draggedColumn);
      const targetIndex = newOrder.indexOf(targetColumnKey);

      if (draggedIndex !== -1 && targetIndex !== -1) {
        // Remove dragged column from its current position
        newOrder.splice(draggedIndex, 1);

        // Insert dragged column at target position
        const adjustedTargetIndex =
          draggedIndex < targetIndex ? targetIndex - 1 : targetIndex;
        newOrder.splice(adjustedTargetIndex, 0, draggedColumn);
      }

      return newOrder;
    });

    setDraggedColumn(null);
  };

  // Handle drag end
  const handleDragEnd = () => {
    setDraggedColumn(null);
  };

  const [plainColumns, setPlainColumns] = useState([
    "name",
    "price",
    "country",
    "industry",
    "sector",
    "mostRecentQuarter",
    "TTM_PE",
    "TTM_EPS",
    "OPM",
    "NPM",
    "ROA",
    "ROE",
    "PB",
  ]);

  // Filter companies based on search term and sortOrder of a column
  const filteredCompanies = useMemo(() => {
    let result = companies;
    // Apply search filter first
    if (searchTerm) {
      result = result.filter((company) =>
        Object.values(company).some((value) =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    result = sortFields(result, sortOrder, sortColumn, plainColumns, columnDefinitions);
    return result;
  }, [companies, searchTerm, sortColumn, sortOrder]);

  const toggleRowAnalysts = (companyId) => {
    setRowAnalystState((prev) => ({
      ...prev,
      [companyId]: !prev[companyId],
    }));
  };

  const shouldShowAnalysts = (companyId) => {
    return showAnalysts || rowAnalystState[companyId];
  };

  const renderCellValue = (company, columnKey, companyId) => {
    const columnDef = columnDefinitions[columnKey];
    var value = 0;
    var analystCount = 0;
    if (plainColumns.includes(columnKey)) {
      value = company.filtered_data[columnKey] ?? 0;
    } else {
      const result = handleFetchComplexFields(company, columnKey);
      value = result?.value ?? 0;
      analystCount = result?.analystCount ?? 0;
    }
    const country = company.filtered_data["country"];
    const formattedValue = formatValue(value, columnDef?.type, country, columnKey, company);

    if (
      shouldShowAnalysts(companyId) &&
      analystCount !== undefined &&
      analystCount !== null &&
      analystCount > 0
    ) {
      return (
        <div>
          <Text size="sm">{formattedValue}</Text>
          <Text size="xs" c="dimmed">
            ({analystCount} analysts)
          </Text>
        </div>
      );
    }

    return formattedValue;
  };

  if (companies.length === 0) {
    return (
      <Paper shadow="xs" p="xl" ta="center">
        <Text size="lg" c="dimmed">
          No companies added yet
        </Text>
        <Text size="sm" c="dimmed">
          Add a company using the form above to get started
        </Text>
      </Paper>
    );
  }

  const displayColumns = columnOrder.filter(
    (col) => visibleColumns.includes(col) && columnDefinitions[col]
  );

  return (
    <div>
      <TableControls
        visibleColumns={visibleColumns}
        onToggleColumn={toggleColumn}
        showAnalysts={showAnalysts}
        onToggleAnalysts={setShowAnalysts}
        columnOrder={columnOrder}
        onResetOrder={resetColumnOrder}
      />

      <Paper shadow="xs">
        <Group p="md" justify="space-between">
          <TextInput
            placeholder="Search companies..."
            leftSection={<IconSearch size={16} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 300 }}
          />
          <Text size="sm" c="dimmed">
            Showing {filteredCompanies.length} of {companies.length} companies
          </Text>
        </Group>

        <ScrollArea>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ width: 40 }}>Actions</Table.Th>
                <Table.Th style={{ width: 100 }}>Toggle Analysts</Table.Th>
                {displayColumns.map((columnKey) => {
                  const columnDef = columnDefinitions[columnKey];
                  const isDragging = draggedColumn === columnKey;

                  return (
                    <Table.Th
                      key={columnKey}
                      style={{
                        width: columnDef?.width || 120,
                        cursor: "move",
                        opacity: isDragging ? 0.5 : 1,
                        backgroundColor: isDragging ? "#f0f8ff" : undefined,
                        userSelect: "none",
                        position: "relative",
                        border: isDragging ? "2px dashed #228be6" : undefined,
                      }}
                      draggable
                      onDragStart={(e) => handleDragStart(e, columnKey)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, columnKey)}
                      onDragEnd={handleDragEnd}
                      onClick={(e) => handleSort(e, columnKey)}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "4px 0",
                        }}
                      >
                        <span style={{ fontSize: "14px", fontWeight: "600" }}>
                          {columnDef?.header || columnKey}
                        </span>
                        {columnDef?.sortable && (
                          <span>
                            {columnKey === sortColumn
                              ? sortOrder === "desc"
                                ? "▲"
                                : "▼"
                              : "⇅"}
                          </span>
                        )}
                      </div>
                      {isDragging && (
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: "rgba(34, 139, 230, 0.1)",
                            border: "2px dashed #228be6",
                            borderRadius: "4px",
                            pointerEvents: "none",
                          }}
                        />
                      )}
                    </Table.Th>
                  );
                })}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredCompanies.map((company, index) => (
                <Table.Tr key={company.id}>
                  <Table.Td>
                    <Tooltip label="Delete company">
                      <ActionIcon
                        color="red"
                        variant="subtle"
                        onClick={() => onDeleteCompany(company.id)}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Tooltip>
                  </Table.Td>

                  <Table.Td>
                    <Tooltip label="Toggle analyst numbers for this row">
                      <Switch
                        size="sm"
                        checked={shouldShowAnalysts(company.id)}
                        onChange={() => toggleRowAnalysts(company.id)}
                        thumbIcon={
                          shouldShowAnalysts(company.id) ? (
                            <IconAnalyze size={12} />
                          ) : null
                        }
                      />
                    </Tooltip>
                  </Table.Td>

                  {displayColumns.map((columnKey) => (
                    <Table.Td key={columnKey}>
                      {renderCellValue(company, columnKey, company.id)}
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Paper>
    </div>
  );
};

export default EarningsTable;
