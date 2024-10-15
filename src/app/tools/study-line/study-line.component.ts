import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgElement, WithProperties } from '@angular/elements';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StaticBoardComponent } from 'src/app/base/components/static-board/static-board.component';
import { StudyComponent } from 'src/app/base/components/study/study.component';
import { Study } from 'src/app/models/study';
import { StudyAction, StudySelector } from 'src/app/rx/study';

@Component({
  selector: 'app-study-line',
  templateUrl: './study-line.component.html',
  styleUrls: ['./study-line.component.scss']
})
export class StudyLineComponent implements OnInit, OnDestroy {

  ngUnsubscribe = new Subject<void>();

  study : Study | undefined;
  studyBody : any | undefined;
  constructor(private route : ActivatedRoute, private store : Store, private sanitizer: DomSanitizer) { }


  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params=> {
      let slug = params["slug"];
      this.store.dispatch(new StudyAction.FetchStudy(slug))
      this.store.select(StudySelector.selectCurrentStudy).subscribe(study  => {
        
        if(study) {
          let tmpStudy = {...study};
          //prepare the components
          let body = tmpStudy.body;
          body = body.split("[[sc").join("<div");
          body = body.split("]]").join(">");
          body = body.split("[[/sc").join("</div");
          this.studyBody = this.sanitizer.bypassSecurityTrustHtml(body);
          setTimeout(()=>{
            //get all offers
            let allStaticBoard = document.getElementsByClassName('static-board')
            if(allStaticBoard.length > 0) {
              for(let i=0; i<allStaticBoard.length; i++) {
                let element = allStaticBoard[i];
                let cElement : NgElement & WithProperties<StaticBoardComponent> = document.createElement('static-board') as any;
                let fenAttr = element.attributes.getNamedItem('fen')
                if(fenAttr) {
                  cElement.fen = fenAttr.nodeValue;
                }
                element.append(cElement);
              }
            }

            let studyChess = document.getElementsByClassName('study-chess')
            if(studyChess.length > 0) {
              for(let i=0; i<studyChess.length; i++) {
                let element = studyChess[i];
                let cElement : NgElement & WithProperties<StudyComponent> = document.createElement('study-chess') as any;
                let studyNameAttr = element.attributes.getNamedItem('studyname')
                
                if(studyNameAttr) {
                  cElement.studyName = studyNameAttr.nodeValue;
                }

                let authorNameAttr = element.attributes.getNamedItem('author')
                
                if(authorNameAttr) {
                  cElement.author = authorNameAttr.nodeValue;
                }

                let gamePgnAttr = element.attributes.getNamedItem('gamepgnstr')
                
                if(gamePgnAttr) {
                  cElement.gamepgnstr = gamePgnAttr.nodeValue;
                }



                element.append(cElement);
              }
            }
        })
        this.study = study
      }})
    })

  }

}
