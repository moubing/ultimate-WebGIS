import {
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import { EChartsOption } from "echarts";
import { createContext } from "react";

export const TableOpenContext = createContext(false);
export const SetTableOpenContext = createContext<
  React.Dispatch<React.SetStateAction<boolean>>
>(() => {});

export const SortingStateContext = createContext<SortingState>([]);
export const SetSortingStateContext = createContext<
  React.Dispatch<React.SetStateAction<SortingState>>
>(() => {});

export const ColumnFiltersStateContext = createContext<ColumnFiltersState>([]);
export const SetColumnFiltersStateContext = createContext<
  React.Dispatch<React.SetStateAction<ColumnFiltersState>>
>(() => {});

export const VisibilityStateContext = createContext<VisibilityState>({});
export const SetVisibilityStateContext = createContext<
  React.Dispatch<React.SetStateAction<VisibilityState>>
>(() => {});

export const PaginationStateContext = createContext<PaginationState>({
  pageIndex: 1,
  pageSize: 20,
});
export const SetPaginationStateContext = createContext<
  React.Dispatch<React.SetStateAction<PaginationState>>
>(() => {});

export const RowSelectionStateContext = createContext<RowSelectionState>({});
export const SetRowSelectionStateContext = createContext<
  React.Dispatch<React.SetStateAction<RowSelectionState>>
>(() => {});

export const ChartOptionsContext = createContext<EChartsOption[]>([]);
export const SetChartOptionsContext = createContext<
  React.Dispatch<React.SetStateAction<EChartsOption[]>>
>(() => {});
