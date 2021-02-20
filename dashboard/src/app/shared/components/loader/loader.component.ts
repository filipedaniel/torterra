import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader',
  template: `
    <div class="loader-container">
      <div class="loading-bar"></div>
    </div>
  `,
  styles: [`
    .loader-container {
      position: fixed;
      top: 0;
      left: 0;
      height: 5px;
      display: block;
      width: 100%;
      background-color: transparent;
      background-clip: padding-box;
      overflow: hidden;
      z-index: 100 }
    .loader-container .loading-bar {
      background-color: #001e13; }
      .loader-container .loading-bar:before {
        content: '';
        position: absolute;
        background-color: inherit;
        top: 0;
        left: 0;
        bottom: 0;
        will-change: left, right;
        -webkit-animation: indeterminate 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
                animation: indeterminate 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite; }
      .loader-container .loading-bar:after {
        content: '';
        position: absolute;
        background-color: inherit;
        top: 0;
        left: 0;
        bottom: 0;
        will-change: left, right;
        -webkit-animation: indeterminate-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;
                animation: indeterminate-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;
        -webkit-animation-delay: 1.15s;
                animation-delay: 1.15s; }
  
    @-webkit-keyframes indeterminate {
      0% {
        left: -35%;
        right: 100%; }
      60% {
        left: 100%;
        right: -90%; }
      100% {
        left: 100%;
        right: -90%; } }
    @keyframes indeterminate {
      0% {
        left: -35%;
        right: 100%; }
      60% {
        left: 100%;
        right: -90%; }
      100% {
        left: 100%;
        right: -90%; } }
    @-webkit-keyframes indeterminate-short {
      0% {
        left: -200%;
        right: 100%; }
      60% {
        left: 107%;
        right: -8%; }
      100% {
        left: 107%;
        right: -8%; } }
    @keyframes indeterminate-short {
      0% {
        left: -200%;
        right: 100%; }
      60% {
        left: 107%;
        right: -8%; }
      100% {
        left: 107%;
        right: -8%; } }
  `]
})

export class LoaderComponent implements OnInit {
  constructor() { }

  ngOnInit() { }
}