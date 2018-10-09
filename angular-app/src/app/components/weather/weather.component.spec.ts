/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2018 Adobe Systems Incorporated
 ~
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~ you may not use this file except in compliance with the License.
 ~ You may obtain a copy of the License at
 ~
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ Unless required by applicable law or agreed to in writing, software
 ~ distributed under the License is distributed on an "AS IS" BASIS,
 ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ~ See the License for the specific language governing permissions and
 ~ limitations under the License.
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherComponent } from './weather.component';
import { AngularWeatherWidgetModule, WeatherApiName } from 'angular-weather-widget';

describe('WeatherComponent', () => {
  let component: WeatherComponent;
  let fixture: ComponentFixture<WeatherComponent>;
  const apiKey = "37375c33ca925949d7ba331e52da661a";

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularWeatherWidgetModule.forRoot({
          key: apiKey,
          name: WeatherApiName.OPEN_WEATHER_MAP,
          baseUrl: 'http://api.openweathermap.org/data/2.5'
        }),
      ],
      declarations: [ WeatherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeatherComponent);
    component = fixture.componentInstance;

    component.apiKey=apiKey; 
    component.city="Basel";

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check default city', () => {
    component.city="";
    expect(component.city).toBe("Basel");
  });

  it('set city', () => {
    component.city="Zurich";
    expect(component.city).toBe("Zurich");
  });
});
