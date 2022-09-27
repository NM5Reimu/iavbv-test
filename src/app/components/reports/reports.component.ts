import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { AgentsService, ReportsService } from '../../services';
import { AgentsResponce, ReportsResponce, DataSource, DataCurrency, TableColumn } from '../../models';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  agentsResponce: AgentsResponce;
  reportResponce: ReportsResponce;

  sources: DataSource[] = [];
  currencys: DataCurrency[] = [];


  cols: TableColumn[] = [
    { field: 'dateAccIn', header: 'Дата' },
    { field: 'id', header: 'ID' },
    { field: 'currency', header: 'Валюта' },
    { field: 'agent', header: 'Агент' },
    { field: 'pointOfSale', header: 'Точка продажи' },
    { field: 'dts', header: 'Источник' },
    { field: 'storno', header: 'Сторно' },
  ]

  constructor( 
    private agentsService: AgentsService,
    private reportService: ReportsService
  ){}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    const agentsResponce$: Subscription = this.agentsService.getAgents().subscribe(data =>  this.agentsResponce = data);

    const reportResponce$: Subscription = this.reportService.getReports().subscribe(data => {
      
      this.reportResponce = data;

      //* Добавляем источники из таблицы без копий
      data.items.map(item => {
        this.sources = this.sources.some((elem: any) => elem.code ===  item.dts.code) ? [...this.sources] : [...this.sources, item.dts];
      })

      //* Добавляем валюту из таблицы
      data.items.map(item => {
        this.currencys = this.currencys.some((elem: any) => elem.code ===  item.currency.code) ? [...this.currencys] : [...this.currencys, item.currency];
      })

      //* Превращаем "дату" в ДАТУ.
      this.reportResponce.items.map(item => {
        item.dateAccIn = new Date(item.dateAccIn);
        item.datInp = new Date(item.datInp);
      })

      //* Сторно из number в boolean для фильра
      this.reportResponce.items.map(item => {
        item.storno = Boolean(item.storno)
      })

    });
  }

}
