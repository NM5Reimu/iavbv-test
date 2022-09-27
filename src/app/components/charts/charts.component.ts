import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { ReportsService } from 'src/app/services';
import { ReportsResponce, Report, ChartData, Dataset } from '../../models';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit {

  reportResponce: ReportsResponce;

  isShowChartBar: boolean = false;

  selectedMultipleDates: null | Date[] = null;
  selectedRangeDates: Date[];

  chartData: any = {
    labels: [],
    datasets: [
        {
            label: 'Reports',
            backgroundColor: '#42A5F5',
            borderColor: '#1E88E5',
            data: []
        }
    ]
  };

  constructor(
    private reportService: ReportsService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    const reportResponce$: Subscription = this.reportService.getReports().subscribe(data => {
      this.reportResponce = data;

      //* Превращаем "дату" в ДАТУ.
      this.reportResponce.items.map(item => {
        item.dateAccIn = new Date(item.dateAccIn);
        item.datInp = new Date(item.datInp);
      })
    });
  }

  buildChartByMultipleDates(): void {
    //* обнуляем лейблы в датасете
    this.chartData.labels = [];
    this.chartData.datasets[0].data = [];

    //* формируем лейблы из выбранных дат используя пайп
    if(this.selectedMultipleDates) this.selectedMultipleDates.map((date: Date) => this.chartData.labels = [...this.chartData.labels, this.datePipe.transform(date, 'MM/dd/yyyy')]);

    //* счетчик. Для каждой выбранной даты проходимся по всем репортам и считаем количество совпавших
    this.chartData.labels.map((filterDate:any) => {
      let counter = 0;
      this.reportResponce.items.map(item => {
        this.datePipe.transform(item.dateAccIn, 'MM/dd/yyyy') === filterDate ? counter++ : counter;
      })

      //*добавляем посчитаное в датасет
      this.chartData.datasets[0].data = [...this.chartData.datasets[0].data, counter];
    })

    this.isShowChartBar = true;
  }


  //! В график выводятся только дни с отчетами
  buildChartByRangeDates([startDate, endDate]:Date[]): void {

    //* сбрасываем данные для графика
    this.chartData = {...this.chartData, labels: [], datasets: [{ label: 'Reports', backgroundColor: '#42A5F5', borderColor: '#1E88E5', data: [] }]}

    //* находим подходящие репорты в выбранном диапазоне
    const reportsInDatesRange: Report[] = this.reportResponce.items.filter((report: Report) => (startDate <= report.dateAccIn && report.dateAccIn <= endDate));

    //* формируем лейблы ТОЛЬКО ДЛЯ ДАТ С РЕПОРТАМИ
    let reportsLabels: string[] = [];
    reportsInDatesRange.map((report: Report) => {
      const checkDate: string = String(this.datePipe.transform(report.dateAccIn, 'MM/dd/yyyy'));
      reportsLabels = reportsLabels.some((elem: string) => elem === checkDate) ? [...reportsLabels] : [...reportsLabels, checkDate];
    })

    //* считаем репорты для каждой даты
    let reportLabelsCounters: number[] = [];
    reportsLabels.map((label:any) => {
      let counter = 0;

      reportsInDatesRange.map((report:Report) => {
        this.datePipe.transform(report.dateAccIn, 'MM/dd/yyyy') === label ? counter++ : counter;
      })

      reportLabelsCounters = [...reportLabelsCounters, counter];
    })

    //* Обновляем данные диаграммы
    this.chartData.labels = reportsLabels;
    this.chartData.datasets[0].data = reportLabelsCounters;

    this.isShowChartBar = true;
  }

  buildChartByAllRangeDates([startDate, endDate]:Date[]): void {

    //* сбрасываем данные для графика
    this.chartData = {...this.chartData, labels: [], datasets: [{ label: 'Reports', backgroundColor: '#42A5F5', borderColor: '#1E88E5', data: [] }]}

    //* находим подходящие репорты в выбранном диапазоне
    const reportsInDatesRange: Report[] = this.reportResponce.items.filter((report: Report) => (startDate <= report.dateAccIn && report.dateAccIn <= endDate));

    //* формируем лейблы ДЛЯ ВСЕГО ДИАПАЗОНА ДАТ
    let allReportsLabels: string[] = [];
    let nextDate: Date = startDate;
    while(nextDate <= endDate){
      allReportsLabels.push(String(this.datePipe.transform(nextDate, 'MM/dd/yyyy')))

      nextDate = new Date(
        nextDate.getFullYear(),
        nextDate.getMonth(),
        nextDate.getDate() + 1,
        nextDate.getHours(),
        nextDate.getMinutes(),
        nextDate.getSeconds())
    }

    //* считаем репорты для каждой даты
    let reportLabelsCounters: number[] = [];
    allReportsLabels.map((label:any) => {
      let counter = 0;

      reportsInDatesRange.map((report:Report) => {
        this.datePipe.transform(report.dateAccIn, 'MM/dd/yyyy') === label ? counter++ : counter;
      })

      reportLabelsCounters = [...reportLabelsCounters, counter];
    })

    //* Обновляем данные диаграммы
    this.chartData.labels = allReportsLabels;
    this.chartData.datasets[0].data = reportLabelsCounters;

    this.isShowChartBar = true;
  }

  clearChart(): void {
    this.chartData = {...this.chartData, labels: [], datasets: [{ label: 'Reports', backgroundColor: '#42A5F5', borderColor: '#1E88E5', data: [] }]}
    this.isShowChartBar = false;
  }

}
