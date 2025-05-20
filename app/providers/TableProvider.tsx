"use client";

import React, { useState } from "react";
import {
  CurrentSourceContext,
  FeatureSelectionContext,
  SetCurrentSourceContext,
  SetFeatureSelectionContext
} from "./contexts";
import { GeoJSONSourceSpecification } from "maplibre-gl";
import { Feature } from "geojson";
import { EChartsOption } from "echarts";
import {
  ChartOptionsContext,
  ColumnFiltersStateContext,
  PaginationStateContext,
  RowSelectionStateContext,
  SetChartOptionsContext,
  SetColumnFiltersStateContext,
  SetPaginationStateContext,
  SetRowSelectionStateContext,
  SetSortingStateContext,
  SetTableOpenContext,
  SetVisibilityStateContext,
  SortingStateContext,
  TableOpenContext,
  VisibilityStateContext
} from "./tabelContext";
import {
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  SortingState,
  VisibilityState
} from "@tanstack/react-table";

function TableProvider({ children }: { children: React.ReactNode }) {
  const [tableOpen, setTableOpen] = useState(false);
  const [currentSource, setCurrentSource] = useState<
    (GeoJSONSourceSpecification & { id: string }) | null
  >(null);
  const [featureSelection, setFeatureSelection] = useState<Feature[]>([]);
  const [chartOptions, setChartOptions] = useState<EChartsOption[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [visibility, setVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  return (
    <TableOpenContext.Provider value={tableOpen}>
      <SetTableOpenContext.Provider value={setTableOpen}>
        <CurrentSourceContext.Provider value={currentSource}>
          <SetCurrentSourceContext.Provider value={setCurrentSource}>
            <FeatureSelectionContext.Provider value={featureSelection}>
              <SetFeatureSelectionContext.Provider value={setFeatureSelection}>
                <ChartOptionsContext.Provider value={chartOptions}>
                  <SetChartOptionsContext.Provider value={setChartOptions}>
                    <SortingStateContext.Provider value={sorting}>
                      <SetSortingStateContext.Provider value={setSorting}>
                        <ColumnFiltersStateContext.Provider
                          value={columnFilters}
                        >
                          <SetColumnFiltersStateContext.Provider
                            value={setColumnFilters}
                          >
                            <VisibilityStateContext.Provider value={visibility}>
                              <SetVisibilityStateContext.Provider
                                value={setVisibility}
                              >
                                <PaginationStateContext.Provider
                                  value={pagination}
                                >
                                  <SetPaginationStateContext.Provider
                                    value={setPagination}
                                  >
                                    <RowSelectionStateContext.Provider
                                      value={rowSelection}
                                    >
                                      <SetRowSelectionStateContext.Provider
                                        value={setRowSelection}
                                      >
                                        {children}
                                      </SetRowSelectionStateContext.Provider>
                                    </RowSelectionStateContext.Provider>
                                  </SetPaginationStateContext.Provider>
                                </PaginationStateContext.Provider>
                              </SetVisibilityStateContext.Provider>
                            </VisibilityStateContext.Provider>
                          </SetColumnFiltersStateContext.Provider>
                        </ColumnFiltersStateContext.Provider>
                      </SetSortingStateContext.Provider>
                    </SortingStateContext.Provider>
                  </SetChartOptionsContext.Provider>
                </ChartOptionsContext.Provider>
              </SetFeatureSelectionContext.Provider>
            </FeatureSelectionContext.Provider>
          </SetCurrentSourceContext.Provider>
        </CurrentSourceContext.Provider>
      </SetTableOpenContext.Provider>
    </TableOpenContext.Provider>
  );
}

export default TableProvider;
