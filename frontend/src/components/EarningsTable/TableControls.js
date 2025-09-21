// components/EarningsTable/TableControls.js
import { useState } from 'react';
import { 
  Group, 
  Switch, 
  Button, 
  Collapse, 
  Text, 
  Paper,
  Stack,
  Divider,
  Badge
} from '@mantine/core';
import { IconSettings, IconEye, IconEyeOff } from '@tabler/icons-react';
import { fieldGroups, fieldCategories } from '../../utils/tableConfig';

const TableControls = ({ 
  visibleColumns, 
  onToggleColumn, 
  showAnalysts, 
  onToggleAnalysts,
  columnOrder,
  onResetOrder,
  sortConfig,
  onResetSort
}) => {
  const [showControls, setShowControls] = useState(false);

  const isGroupVisible = (groupFields) => {
    return groupFields.some(field => visibleColumns.includes(field));
  };

  const toggleGroup = (groupFields, shouldShow = null) => {
    const show = shouldShow !== null ? shouldShow : !isGroupVisible(groupFields);
    groupFields.forEach(field => {
      if (show && !visibleColumns.includes(field)) {
        onToggleColumn(field);
      } else if (!show && visibleColumns.includes(field)) {
        onToggleColumn(field);
      }
    });
  };

  const getVisibleCount = (groupFields) => {
    return groupFields.filter(field => visibleColumns.includes(field)).length;
  };

  return (
    <Paper shadow="xs" p="md" mb="md">
              <Group justify="space-between" mb="md">
        <Group>
          <IconSettings size={20} />
          <Text weight={500}>Table Configuration</Text>
          <Badge color="blue" variant="light">
            {visibleColumns.length} columns visible
          </Badge>
          {sortConfig?.key && (
            <Badge color="green" variant="light">
              Sorted by {sortConfig.key} ({sortConfig.direction})
            </Badge>
          )}
        </Group>
        <Button
          variant="subtle"
          onClick={() => setShowControls(!showControls)}
          rightSection={showControls ? <IconEyeOff size={16} /> : <IconEye size={16} />}
        >
          {showControls ? 'Hide Controls' : 'Show Controls'}
        </Button>
      </Group>

      <Collapse in={showControls}>
        <Stack gap="md">
          {/* Global Controls */}
          <Group>
            <Switch
              label="Show Analyst Numbers"
              checked={showAnalysts}
              onChange={(event) => onToggleAnalysts(event.currentTarget.checked)}
            />
          </Group>

          <Divider />

          {/* Period Controls */}
          <div>
            <Text size="sm" weight={500} mb="xs">Time Periods</Text>
            <Group>
              <Button
                variant={isGroupVisible(fieldGroups.quarters) ? "filled" : "light"}
                size="xs"
                onClick={() => toggleGroup(fieldGroups.quarters)}
              >
                Quarters ({getVisibleCount(fieldGroups.quarters)}/{fieldGroups.quarters.length})
              </Button>
              <Button
                variant={isGroupVisible(fieldGroups.yearly) ? "filled" : "light"}
                size="xs"
                onClick={() => toggleGroup(fieldGroups.yearly)}
              >
                Yearly ({getVisibleCount(fieldGroups.yearly)}/{fieldGroups.yearly.length})
              </Button>
              <Button
                variant={isGroupVisible(fieldGroups.yearAgo) ? "filled" : "light"}
                size="xs"
                onClick={() => toggleGroup(fieldGroups.yearAgo)}
              >
                Year Ago ({getVisibleCount(fieldGroups.yearAgo)}/{fieldGroups.yearAgo.length})
              </Button>
            </Group>
          </div>

          <Divider />

          {/* Metric Categories */}
          <div>
            <Text size="sm" weight={500} mb="xs">Metrics</Text>
            <Group>
              <Button
                variant={isGroupVisible(fieldCategories.eps) ? "filled" : "light"}
                size="xs"
                onClick={() => toggleGroup(fieldCategories.eps)}
              >
                EPS ({getVisibleCount(fieldCategories.eps)}/{fieldCategories.eps.length})
              </Button>
              <Button
                variant={isGroupVisible(fieldCategories.epsGrowth) ? "filled" : "light"}
                size="xs"
                onClick={() => toggleGroup(fieldCategories.epsGrowth)}
              >
                EPS Growth ({getVisibleCount(fieldCategories.epsGrowth)}/{fieldCategories.epsGrowth.length})
              </Button>
              <Button
                variant={isGroupVisible(fieldCategories.pe) ? "filled" : "light"}
                size="xs"
                onClick={() => toggleGroup(fieldCategories.pe)}
              >
                P/E ({getVisibleCount(fieldCategories.pe)}/{fieldCategories.pe.length})
              </Button>
              <Button
                variant={isGroupVisible(fieldCategories.peg) ? "filled" : "light"}
                size="xs"
                onClick={() => toggleGroup(fieldCategories.peg)}
              >
                PEG ({getVisibleCount(fieldCategories.peg)}/{fieldCategories.peg.length})
              </Button>
              <Button
                variant={isGroupVisible(fieldCategories.revenueGrowth) ? "filled" : "light"}
                size="xs"
                onClick={() => toggleGroup(fieldCategories.revenueGrowth)}
              >
                Revenue Growth ({getVisibleCount(fieldCategories.revenueGrowth)}/{fieldCategories.revenueGrowth.length})
              </Button>
            </Group>
          </div>

          <Divider />

          {/* Company Info */}
          <div>
            <Text size="sm" weight={500} mb="xs">Company Information</Text>
            <Group>
              <Button
                variant={isGroupVisible(fieldGroups.company) ? "filled" : "light"}
                size="xs"
                onClick={() => toggleGroup(fieldGroups.company)}
              >
                Company Details ({getVisibleCount(fieldGroups.company)}/{fieldGroups.company.length})
              </Button>
              <Button
                variant={isGroupVisible(fieldGroups.ttm) ? "filled" : "light"}
                size="xs"
                onClick={() => toggleGroup(fieldGroups.ttm)}
              >
                TTM Metrics ({getVisibleCount(fieldGroups.ttm)}/{fieldGroups.ttm.length})
              </Button>
            </Group>
          </div>

          <Divider />

          {/* Quick Actions */}
          <div>
            <Text size="sm" weight={500} mb="xs">Quick Actions</Text>
            <Group>
              <Button
                size="xs"
                variant="outline"
                onClick={() => {
                  Object.values(fieldGroups).flat().forEach(field => {
                    if (!visibleColumns.includes(field) && field !== 'name' && field !== 'price') {
                      onToggleColumn(field);
                    }
                  });
                }}
              >
                Show All
              </Button>
              <Button
                size="xs"
                variant="outline"
                color="red"
                onClick={() => {
                  visibleColumns.forEach(field => {
                    if (field !== 'name' && field !== 'price') {
                      onToggleColumn(field);
                    }
                  });
                }}
              >
                Hide All (Keep Name & Price)
              </Button>
              <Button
                size="xs"
                variant="outline"
                color="blue"
                onClick={onResetOrder}
              >
                Reset Column Order
              </Button>
              {sortConfig?.key && (
                <Button
                  size="xs"
                  variant="outline"
                  color="green"
                  onClick={onResetSort}
                >
                  Clear Sort
                </Button>
              )}
            </Group>
          </div>
        </Stack>
      </Collapse>
    </Paper>
  );
};

export default TableControls;