import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Hashing } from './hashing';
import { provideRouter } from '@angular/router';
import { render, screen } from '@testing-library/angular';

describe('Hashing', () => {
  let component: Hashing;
  let fixture: ComponentFixture<Hashing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hashing],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Hashing);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should have a loadHash method', () => {
    expect(component.loadHash).toBeDefined();
  });
  it('should have a loadHash method that is a function', () => {
    expect(typeof component.loadHash).toBe('function');
  });
  it('should have the sha512 text in the template', async () => {
    TestBed.resetTestingModule();
    await render(Hashing, { providers: [provideRouter([])] });
    expect(screen.getByText('sha512')).toBeTruthy();
  });
  it('should have the md5 text in the template', async () => {
    TestBed.resetTestingModule();
    await render(Hashing, { providers: [provideRouter([])] });
    expect(screen.getByText('md5')).toBeTruthy();
  });
  it('should have the Hashing text in the template', async () => {
    TestBed.resetTestingModule();
    await render(Hashing, { providers: [provideRouter([])] });
    expect(screen.getByText('Hashing')).toBeTruthy();
  });
  it('should have the Convertieren text in the template', async () => {
    TestBed.resetTestingModule();
    await render(Hashing, { providers: [provideRouter([])] });
    expect(screen.getByText('Convertieren')).toBeTruthy();
  });
  it('should render the input label text in the template', async () => {
    TestBed.resetTestingModule();
    await render(Hashing, { providers: [provideRouter([])] });
    expect(
      screen.getByText(/Bitte gib mir den Text an, den ich convertieren soll\.:/i),
    ).toBeTruthy();
  });
});
