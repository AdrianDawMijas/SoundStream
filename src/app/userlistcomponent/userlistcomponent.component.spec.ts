import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserlistcomponentComponent } from './userlistcomponent.component';

describe('UserlistcomponentComponent', () => {
  let component: UserlistcomponentComponent;
  let fixture: ComponentFixture<UserlistcomponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserlistcomponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserlistcomponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
