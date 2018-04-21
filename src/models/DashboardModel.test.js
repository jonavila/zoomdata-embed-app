import { DashboardModel } from './DashboardModel';

export const dashboardMock = {
  id: '5a1dddf460b253b41b60e545',
  name: 'Sales by Payment Type',
  description: '',
  layout: '4-column',
  shareState: 'VIEW_ONLY',
  visualizations: [
    {
      id: '5a95939660b206031965a706',
      visId: '598c14a660b2eb1a5e9c8b16',
      ownerDashboardId: '5a1dddf460b253b41b60e545',
      name: 'Bars',
      type: 'UBER_BARS',
      enabled: false,
      widgetId: '347da1e9e0eaa16ebad7b4868e5ca8ac',
      layout: {
        col: 9,
        row: 1,
        rowSpan: 12,
        colSpan: 8,
      },
      source: {
        variables: {
          'Multi Group By': [
            {
              name: 'payment_type',
              limit: 50,
              sort: {
                dir: 'desc',
                name: 'count',
                label: 'Volume',
                type: 'COUNT',
              },
              type: 'ATTRIBUTE',
              label: 'Payment Type',
              groupColorSet: 'ZoomPalette',
              autoShowColorLegend: true,
              colorNumb: 2,
              autoColor: true,
              groupColors: {},
            },
          ],
          'Chart Name': 'Sales (1)',
          'Bar Color': [
            {
              name: 'count',
              colorConfig: {
                colorNumb: 3,
                legendType: 'palette',
                colors: [],
                colorSet: 'ZoomSequential',
                autoShowColorLegend: true,
                autoColor: true,
                colorScaleType: 'gradient',
              },
            },
          ],
          Metric: [
            {
              name: 'price',
              func: 'sum',
            },
          ],
          'Chart Description': '',
          UberBarsSettings: {
            showXGrid: true,
            showYGrid: true,
            chartType: 'plain',
            chartOrientation: 'vertical',
            thickness: '100',
            showAbsoluteValues: false,
            showRelativeValues: false,
            showGroupLabels: true,
            enableLogScale: false,
          },
          Font: {
            barLabels: {
              size: 'normal',
              typeface: 'sans',
              align: 'left',
              style: '',
            },
            title: {
              size: 'normal',
              typeface: 'sans',
              align: 'left',
              style: '',
            },
          },
          Rulers: {
            gridlines: {
              X1grid: false,
              Y1grid: true,
              X2grid: false,
              Y2grid: false,
            },
            axis: [
              {
                axis: 'Metric',
                name: 'Metric',
                metricsName: 'Price',
                from: 0,
                to: 200000,
                step: 50000,
                fromAuto: true,
                toAuto: true,
                stepAuto: true,
                logScaleEnabled: false,
                type: 'yAxis',
              },
            ],
            reflines: [],
          },
          _SubheadFiltersList: true,
        },
        filters: [
          {
            operation: 'IN',
            value: ['Amex', 'Diners'],
            path: 'payment_type',
          },
        ],
        aggregateFilters: [],
        sourceId: '5a1d7bdf60b253b41b60e4df',
        sourceType: 'EDC2',
        playbackMode: false,
        textSearchEnabled: false,
        sourceName: 'Sales',
        live: false,
      },
      dashboardLink: {
        inheritFilterCfg: true,
      },
      controlsCfg: {
        id: '5acf790f60b2ac157b4ca496',
        dashboardId: '5a1dddf460b253b41b60e545',
        visualizationDefId: '5a95939660b206031965a706',
        timeControlCfg: {
          from: '+$start_of_data',
          to: '+$end_of_data',
          timeField: 'transaction_date',
        },
      },
      lastModified: 0,
      filterableInAggregate: true,
    },
    {
      id: '5a1dddf460b253b41b60e547',
      visId: '598c14a660b2eb1a5e9c8b16',
      ownerDashboardId: '5a1dddf460b253b41b60e545',
      name: 'Bars',
      type: 'UBER_BARS',
      enabled: false,
      widgetId: 'e8c56378159ba0acbddf84952db10831',
      layout: {
        col: 1,
        row: 1,
        rowSpan: 12,
        colSpan: 8,
      },
      source: {
        variables: {
          'Multi Group By': [
            {
              name: 'payment_type',
              limit: 50,
              sort: {
                dir: 'desc',
                name: 'price',
                label: 'Price',
                type: 'NUMBER',
                metricFunc: 'sum',
              },
              type: 'ATTRIBUTE',
              label: 'Payment Type',
              groupColorSet: 'ZoomSequential',
              autoShowColorLegend: false,
              colorNumb: 2,
              autoColor: true,
              groupColors: {},
            },
          ],
          'Chart Name': 'Sales',
          'Bar Color': [
            {
              name: 'count',
              colorConfig: {
                colorNumb: 3,
                legendType: 'palette',
                colors: [
                  {
                    name: 'Color 1',
                    color: '#ffc65f',
                  },
                  {
                    name: 'Color 2',
                    color: '#9eb778',
                  },
                  {
                    name: 'Color 3',
                    color: '#0096b6',
                  },
                ],
                colorSet: 'ZoomSequential',
                autoShowColorLegend: true,
                autoColor: true,
                colorScaleType: 'gradient',
              },
            },
          ],
          Metric: [
            {
              name: 'price',
              func: 'sum',
            },
          ],
          'Chart Description': '',
          UberBarsSettings: {
            showXGrid: true,
            showYGrid: true,
            chartType: 'plain',
            chartOrientation: 'vertical',
            thickness: '100',
            showAbsoluteValues: false,
            showRelativeValues: false,
            showGroupLabels: true,
            enableLogScale: false,
          },
          Font: {
            barLabels: {
              size: 'normal',
              typeface: 'sans',
              align: 'left',
              style: '',
            },
            title: {
              size: 'normal',
              typeface: 'sans',
              align: 'left',
              style: '',
            },
          },
          Rulers: {
            gridlines: {
              X1grid: false,
              Y1grid: true,
              X2grid: false,
              Y2grid: false,
            },
            axis: [
              {
                axis: 'Metric',
                name: 'Metric',
                metricsName: 'Price',
                from: 0,
                to: 200000,
                step: 50000,
                fromAuto: true,
                toAuto: true,
                stepAuto: true,
                logScaleEnabled: false,
                type: 'yAxis',
              },
            ],
            reflines: [],
          },
        },
        filters: [
          {
            operation: 'IN',
            value: ['Amex', 'Diners'],
            path: 'payment_type',
          },
        ],
        aggregateFilters: [],
        sourceId: '5a1d7bdf60b253b41b60e4df',
        sourceType: 'EDC2',
        playbackMode: false,
        textSearchEnabled: false,
        sourceName: 'Sales',
        live: false,
      },
      dashboardLink: {
        inheritFilterCfg: true,
      },
      controlsCfg: {
        id: '5acf790f60b2ac157b4ca497',
        dashboardId: '5a1dddf460b253b41b60e545',
        visualizationDefId: '5a1dddf460b253b41b60e547',
      },
      lastModified: 0,
      filterableInAggregate: true,
    },
  ],
  selectedWidgetId: 'e8c56378159ba0acbddf84952db10831',
  ownerName: 'jonathan',
  type: 'DASHBOARD',
};

it('can create an instance of a dashboard', () => {
  const dashboard = DashboardModel.create(dashboardMock);

  dashboard.changeName('Sales by Product');
  expect(dashboard.name).toBe('Sales by Product');
});
