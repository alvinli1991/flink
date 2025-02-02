/*
 *   Licensed to the Apache Software Foundation (ASF) under one
 *   or more contributor license agreements.  See the NOTICE file
 *   distributed with this work for additional information
 *   regarding copyright ownership.  The ASF licenses this file
 *   to you under the Apache License, Version 2.0 (the
 *   "License"); you may not use this file except in compliance
 *   with the License.  You may obtain a copy of the License at
 *       http://www.apache.org/licenses/LICENSE-2.0
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';

import { EditorOptions } from 'ng-zorro-antd/code-editor/typings';
import { flinkEditorOptions } from 'share/common/editor/editor-config';

import { TaskManagerDetailInterface } from 'interfaces';
import { TaskManagerService } from 'services';

@Component({
  selector: 'flink-task-manager-log-detail',
  templateUrl: './task-manager-log-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.full-screen]': 'isFullScreen'
  },
  styleUrls: ['./task-manager-log-detail.component.less']
})
export class TaskManagerLogDetailComponent implements OnInit, OnDestroy {
  logs = '';
  logName = '';
  downloadUrl = '';
  isLoading = false;
  taskManagerDetail: TaskManagerDetailInterface;
  isFullScreen = false;
  editorOptions: EditorOptions = flinkEditorOptions;
  private destroy$ = new Subject<void>();

  constructor(
    private taskManagerService: TaskManagerService,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute
  ) {}

  reloadLog(): void {
    this.isLoading = true;
    this.cdr.markForCheck();
    this.taskManagerService
      .loadLog(this.taskManagerDetail.id, this.logName)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        data => {
          this.logs = data.data;
          this.downloadUrl = data.url;
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        () => {
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      );
  }

  toggleFullScreen(fullScreen: boolean): void {
    this.isFullScreen = fullScreen;
  }

  ngOnInit(): void {
    this.taskManagerService.taskManagerDetail$.pipe(first(), takeUntil(this.destroy$)).subscribe(data => {
      this.taskManagerDetail = data;
      this.logName = this.activatedRoute.snapshot.params.logName;
      this.reloadLog();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
