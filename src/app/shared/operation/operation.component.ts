import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';

import { Permission, PermissionAPI } from '../../core';

@Component({
  selector: 'berry-operation',
  templateUrl: './operation.component.html',
  styleUrls: ['./operation.component.scss'],
})
export class OperationComponent implements OnInit {
  formGroup: UntypedFormGroup = this.formBuilder.group({});
  @Input() permission: Permission = {permission: '', resourceType: ''};
  @Input() readOnly = true;
  @Output() changed = new EventEmitter();

  constructor(
    private formBuilder: UntypedFormBuilder,
    private permissionAPI: PermissionAPI,
  ) {
  }

  ngOnInit() {
    if (this.permission.permission) {
      this.formGroup = this.formBuilder.group({
        'create': [{value: this.permission.permission.includes('c'), disabled: this.readOnly}, null],
        'read':   [{value: this.permission.permission.includes('r'), disabled: this.readOnly}, null],
        'update': [{value: this.permission.permission.includes('u'), disabled: this.readOnly}, null],
        'delete': [{value: this.permission.permission.includes('d'), disabled: this.readOnly}, null],
      });
    }
  }

  toggle() {
    let ops = '';

    if (this.formGroup.value.create) {
      ops += 'c';
    }
    if (this.formGroup.value.read) {
      ops += 'r';
    }
    if (this.formGroup.value.update) {
      ops += 'u';
    }
    if (this.formGroup.value.delete) {
      ops += 'd';
    }

    if (this.permission.id && this.permission.permission) {
      if (ops == '') {
        if(confirm('Are you sure to delete this permission?')) {
          this.permissionAPI.removePermission(this.permission.id).subscribe(() => {
            this.changed.emit();
          });
        } else {
          this.formGroup = this.formBuilder.group({
            'create': [{value: this.permission.permission.includes('c'), disabled: this.readOnly}, null],
            'read':   [{value: this.permission.permission.includes('r'), disabled: this.readOnly}, null],
            'update': [{value: this.permission.permission.includes('u'), disabled: this.readOnly}, null],
            'delete': [{value: this.permission.permission.includes('d'), disabled: this.readOnly}, null],
          });
        }
      } else {
        this.permission.permission = ops;
        this.permissionAPI.updatePermission(this.permission.id, this.permission).subscribe(() => {
          this.changed.emit();
        });
      }
    }
  }

}
