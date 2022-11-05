const { describe, expect, test } = require('@jest/globals');
const { getWeeksDiff } = require('../src/helpers/dateHelper');
const startDate = new Date(2022, 10, 5);

describe('Test Weeks difference', () => {

    test('1 day passed', () => {
        expect(getWeeksDiff(startDate, new Date(2022, 10, 6))).toStrictEqual(
            0
        );
    });

    test('2 day passed', () => {
        expect(getWeeksDiff(startDate, new Date(2022, 10, 7))).toStrictEqual(
            0
        );
    });

    test('3 day passed', () => {
        expect(getWeeksDiff(startDate, new Date(2022, 10, 8))).toStrictEqual(
            0
        );
    });

    test('4 day passed', () => {
        expect(getWeeksDiff(startDate, new Date(2022, 10, 9))).toStrictEqual(
            0
        );
    });

    test('5 day passed', () => {
        expect(getWeeksDiff(startDate, new Date(2022, 10, 10))).toStrictEqual(
            0
        );
    });

    test('6 day passed', () => {
        expect(getWeeksDiff(startDate, new Date(2022, 10, 11))).toStrictEqual(
            0
        );
    });

    test('7 day passed', () => {
        expect(getWeeksDiff(startDate, new Date(2022, 10, 12))).toStrictEqual(
            1
        );
    });

    test('8 day passed', () => {
        expect(getWeeksDiff(startDate, new Date(2022, 10, 13))).toStrictEqual(
            1
        );
    });

    test('9 day passed', () => {
        expect(getWeeksDiff(startDate, new Date(2022, 10, 14))).toStrictEqual(
            1
        );
    });

    test('10 day passed', () => {
        expect(getWeeksDiff(startDate, new Date(2022, 10, 14))).toStrictEqual(
            1
        );
    });
});
