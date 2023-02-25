import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicManagerComponent } from './topic.component';

describe('TopicManagerComponent', () => {
  let component: TopicManagerComponent;
  let fixture: ComponentFixture<TopicManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicManagerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopicManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
