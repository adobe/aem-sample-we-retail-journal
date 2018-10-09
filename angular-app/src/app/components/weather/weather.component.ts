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

import { Component, OnInit, Input } from '@angular/core';
import { WeatherSettings, TemperatureScale, ForecastMode,
        WeatherLayout,  CURRENT_WATHER_MOCK, FORECAST_MOCK,
        CurrentWeather, Forecast, WeatherApiService } from 'angular-weather-widget';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit{
  private _apiKey;
  private _city;

  public settings: WeatherSettings = {
    location: {
      cityName: ''
    },
    backgroundColor: 'transparent',
    color: '#ffffff',
    width: '300px',
    height: 'auto',
    showWind: false,
    scale: TemperatureScale.CELCIUS,
    forecastMode: ForecastMode.GRID,
    showDetails: false,
    showForecast: false,
    layout: WeatherLayout.NARROW,
    language: 'en'
  };

  @Input()
  set apiKey(data) {
    this._apiKey = data;
    this.updateSettings();
  };

  /**
   * @default Basel
   */
  @Input()
  set city(data) {
    this._city = data || "Basel";
    this.updateSettings();
  };

  constructor(private weatherService: WeatherApiService) {
    this.weatherService.apiConfig.key =  this.apiKey;
    this.updateSettings();
  }

  /**
   * Returns the apiKey of the component
   */
  get apiKey() {
    return this._apiKey;
  }

  get city() {
    return this._city;
  }

  /**
   * updates the settings of the component
   */
  private updateSettings() {
    this.weatherService.apiConfig.key =  this.apiKey;
    this.settings.location.cityName = this.city;
    this.settings = Object.assign({}, this.settings);
  }

  ngOnInit() {
    this.settings.location.cityName = this.city;
  }

  currentWeather: CurrentWeather = CURRENT_WATHER_MOCK;
  forecast: Forecast[] = FORECAST_MOCK;
}
