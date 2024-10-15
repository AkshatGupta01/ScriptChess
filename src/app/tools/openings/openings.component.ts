import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Meta, Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ECO } from 'src/app/models/eco';
import { GameAction, GameSelector } from 'src/app/rx/games';
import { metaMap } from 'src/app/static-data/meta';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-openings',
  templateUrl: './openings.component.html',
  styleUrls: ['./openings.component.scss']
})
export class OpeningsComponent implements OnInit, OnDestroy {

  ecos : ECO[] = []
  allEcos : ECO[]
  dataSource : MatTableDataSource<ECO> = new MatTableDataSource([]);
  ngUnsubscribe = new Subject<void>();
  isLoading: boolean = false
  displayedColumns : string[] = ["eco", "count", "name", "position", "checkGames"]
  itemsPerPage = 1000;
  totalData = 10;
  displayEcoPerPage = 20;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private store : Store, private meta : Meta, private titleService : Title) { 
    if(this.meta.getTag("description")) {
      this.meta.updateTag({'name': 'description', content: metaMap["Learn Openings"].description})
    } else {
      this.meta.addTag({'name': 'description', content: metaMap["Learn Openings"].description})
    }
    this.titleService.setTitle(metaMap["Learn Openings"].title)
    this.dataSource.sortingDataAccessor = (data, sortHeaderId)=> {
      switch(sortHeaderId) {
        case "eco":
          return data["eco"];
        case "count":  
          return data["count"];
        case "name":
          return data["ecoModel"].name;
      }
    }
  }

  ngOnInit(): void {
    this.store.dispatch(new GameAction.FetchTopOpenings(this.itemsPerPage))
    
    

    this.store.select(GameSelector.selectIsLoading).pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(loading => {
        this.isLoading = loading;
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    setTimeout(() => {
      this.store.select(GameSelector.selectTopOpenings).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(ecos => {
        if(ecos && ecos.length > 0) {         

          this.allEcos = ecos;
          
          
          this.populateEcoTable()
          
        }
          
      })  
    });    
  }

  populateEcoTable() {
    if(!this.paginator)
      this.ecos = this.allEcos.slice(0, this.displayEcoPerPage)
    else
      this.ecos = this.allEcos.slice(0, this.paginator.pageSize)
    this.dataSource = new MatTableDataSource(this.ecos);
          
    this.dataSource.filterPredicate = (eco: ECO, filter: string)=>{
      return eco.ecoModel.name.toLowerCase().indexOf(filter.toLowerCase()) > -1 || eco.ecoModel.eco.indexOf(filter) > -1
    }
    this.totalData = this.allEcos.length;
    this.dataSource._updateChangeSubscription();
  }


  getEcoCount(name) {
    if(this.allEcos) {
      let ecos = this.allEcos.filter(e=>e.ecoModel.name == name)
      if(ecos && ecos.length > 0)
        return ecos[0].count;
    }    
    return 0;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  applyFilter(event: Event) {
    
    const filterValue = (event.target as HTMLInputElement).value;
    if(filterValue.length < 3) {
      this.dataSource.filter = filterValue;
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    } else {
      this.store.dispatch(new GameAction.SearchOpenings(filterValue))
      this.ecos = []
      this.store.select(GameSelector.selectOpenings).pipe(takeUntil(this.ngUnsubscribe)).subscribe(ecos=> {
        if(ecos && ecos.length > 0) {
          let tmpAllEco = [];
          ecos.forEach(e=> {
            let tmpEco = {
              eco : e["eco"],
              count : this.getEcoCount(e["name"]),
              ecoModel : e
            }
            tmpAllEco.push(tmpEco)
          })
          this.allEcos = tmpAllEco; 
          this.populateEcoTable();
        } else {
          this.ecos = []
          this.populateEcoTable();
        }
        
      })
    }
    
  }

  handlePageEvent(e:PageEvent) {
    this.ecos = this.allEcos.slice(e.pageIndex * e.pageSize, (e.pageIndex + 1) * e.pageSize)
          
    this.dataSource = new MatTableDataSource(this.ecos);
  }

}
