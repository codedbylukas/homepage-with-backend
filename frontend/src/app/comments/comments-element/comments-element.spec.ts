import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsElement } from './comments-element';

describe('CommentsElement', () => {
  let component: CommentsElement;
  let fixture: ComponentFixture<CommentsElement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentsElement],
    }).compileComponents();

    fixture = TestBed.createComponent(CommentsElement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
