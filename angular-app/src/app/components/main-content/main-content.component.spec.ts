import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainContentComponent } from './main-content.component';
import {AppRoutingModule} from "../../app-routing.module";
import {ModelManagerService} from "../model-manager.service";
import {BrowserTransferStateModule} from "@angular/platform-browser";
import {SpaAngularEditableComponentsModule} from "@adobe/cq-angular-editable-components";
import {APP_BASE_HREF} from "@angular/common";
import { ModelManager } from '@adobe/cq-spa-page-model-manager';

describe('MainContentComponent', () => {
  let component: MainContentComponent;
  let fixture: ComponentFixture<MainContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ SpaAngularEditableComponentsModule, AppRoutingModule, BrowserTransferStateModule ],
      providers: [ ModelManagerService,
        { provide: APP_BASE_HREF, useValue: '/' }],
      declarations: [ MainContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    // Stub ModelManager
    spyOn(ModelManager, "getData").and.callFake(function() {
      return Promise.resolve({});
    });

    fixture = TestBed.createComponent(MainContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
