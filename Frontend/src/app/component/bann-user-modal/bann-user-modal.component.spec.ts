import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannUserModalComponent } from './bann-user-modal.component';

describe('BannUserModalComponent', () => {
  let component: BannUserModalComponent;
  let fixture: ComponentFixture<BannUserModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannUserModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BannUserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
