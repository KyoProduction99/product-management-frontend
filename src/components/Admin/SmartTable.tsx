import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Button, Input, message, Table } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { ColumnType, TableProps } from "antd/es/table";

interface SmartTableProps<T>
  extends Omit<TableProps<T>, "columns" | "dataSource"> {
  columns: ColumnType<T>[];
  searchableColumns?: string[];
  onFetchData: (params: any) => Promise<{ data: T[]; total: number }>;
}

export interface SmartTableRef {
  refetch: () => void;
}

function SmartTableInner<T extends object>(
  props: SmartTableProps<T>,
  ref: React.Ref<SmartTableRef>
) {
  const { columns, searchableColumns = [], onFetchData, ...rest } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<Record<string, string | string[]>>({});
  const [sorter, setSorter] = useState<{
    field?: string;
    order?: "ASC" | "DESC";
  }>({});

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await onFetchData({
        page: currentPage,
        limit: pageSize,
        ...filters,
        ...(sorter && {
          sortField: sorter.field,
          sortOrder: sorter.order,
        }),
      });
      setData(response.data);
      setTotal(response.total);
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch items");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, filters, sorter, onFetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useImperativeHandle(ref, () => ({
    refetch: () => fetchData(),
  }));

  const handleTableChange = (
    pagination: any,
    tableFilters: any,
    sortInfo: any
  ) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);

    if (sortInfo.field) {
      setSorter({
        field: sortInfo.field,
        order: sortInfo.order === "ascend" ? "ASC" : "DESC",
      });
    } else {
      setSorter({});
    }

    const newFilters: Record<string, string | string[]> = {};
    Object.entries(tableFilters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        newFilters[key] = value as string[];
      }
    });
    setFilters(newFilters);
  };

  const getColumnSearchProps = (dataIndex: string): ColumnType<T> => ({
    filterDropdown: ({
      selectedKeys,
      setSelectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => confirm()}
          style={{ marginBottom: 8, display: "block" }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            type="text"
            size="small"
            onClick={() => {
              clearFilters?.();
              setSelectedKeys([]);
              setFilters((prev) => {
                const updated = { ...prev };
                delete updated[dataIndex];
                return updated;
              });
              setCurrentPage(1);
              confirm();
            }}
            style={{ color: "#1677ff" }}
          >
            Reset
          </Button>
          <Button type="primary" size="small" onClick={() => confirm()}>
            Search
          </Button>
        </div>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
  });

  const enhancedColumns = columns.map((col) =>
    (searchableColumns ?? []).includes(col.dataIndex as string)
      ? { ...col, ...getColumnSearchProps(col.dataIndex as string) }
      : col
  );
  return (
    <Table<T>
      rowKey="id"
      loading={isLoading}
      columns={enhancedColumns}
      dataSource={data}
      pagination={{
        total,
        current: currentPage,
        pageSize,
        showSizeChanger: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} items`,
      }}
      onChange={handleTableChange}
      scroll={{ x: 768 }}
      {...rest}
    />
  );
}

const SmartTable = forwardRef(SmartTableInner) as <T extends object>(
  props: SmartTableProps<T> & { ref?: React.Ref<SmartTableRef> }
) => ReturnType<typeof SmartTableInner>;

export default SmartTable;
