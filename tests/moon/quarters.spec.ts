import { Quarter, NewMoon, FirstQuarter, FullMoon, LastQuarter } from '../../src/moon/quarters';

describe('Quarters Factory', () => {
    describe('Inheritance', () => {
        test('New Moon', () => expect(Quarter.newMoon()).toBeInstanceOf(Quarter));
        test('First Quarter', () => expect(Quarter.firstQuarter()).toBeInstanceOf(Quarter));
        test('Full Moon', () => expect(Quarter.fullMoon()).toBeInstanceOf(Quarter));
        test('Last Quarter', () => expect(Quarter.lastQuarter()).toBeInstanceOf(Quarter));
    });   
    describe('Instance', () => {
        test('New Moon', () => expect(Quarter.newMoon()).toBeInstanceOf(NewMoon));
        test('First Quarter', () => expect(Quarter.firstQuarter()).toBeInstanceOf(FirstQuarter));
        test('Full Moon', () => expect(Quarter.fullMoon()).toBeInstanceOf(FullMoon));
        test('Last Quarter', () => expect(Quarter.lastQuarter()).toBeInstanceOf(LastQuarter));
    });      
    describe('Singletons', () => {
        test('New Moon', () => expect(Quarter.newMoon()).toBe(Quarter.newMoon()));
        test('First Quarter', () => expect(Quarter.firstQuarter()).toBe(Quarter.firstQuarter()));
        test('Full Moon', () => expect(Quarter.fullMoon()).toBe(Quarter.fullMoon()));
        test('Last Quarter', () => expect(Quarter.lastQuarter()).toBe(Quarter.lastQuarter()));
    });       
    describe('Names', () => {
        test('New Moon', () => expect(Quarter.newMoon().name).toBe('New Moon'));
        test('First Quarter', () => expect(Quarter.firstQuarter().name).toBe('First Quarter'));
        test('Full Moon', () => expect(Quarter.fullMoon().name).toBe('Full Moon'));
        test('Last Quarter', () => expect(Quarter.lastQuarter().name).toBe('Last Quarter'));
    });
    describe('Coefficients', () => {
        test('New Moon', () => expect(Quarter.newMoon().coeff).toBeCloseTo(0.0));
        test('First Quarter', () => expect(Quarter.firstQuarter().coeff).toBeCloseTo(0.25));
        test('Full Moon', () => expect(Quarter.fullMoon().coeff).toBeCloseTo(0.5));
        test('Last Quarter', () => expect(Quarter.lastQuarter().coeff).toBeCloseTo(0.75));
    });    
   
});


