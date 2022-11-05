const { describe, expect, test } = require('@jest/globals');
const { getNewAppointementsOnly } = require('../src/helpers/arrayHelper');

const appointment1 = { date: new Date(2020, 4, 15), hebrewDay: "ראשון", time: "10:40" };
const appointment2 = { date: new Date(2020, 4, 15), hebrewDay: "ראשון", time: "11:40" };
const appointment3 = { date: new Date(2020, 4, 15), hebrewDay: "ראשון", time: "12:40" };

describe('Test sustracting new appointments from known appointments', () => {

    test('Only new appointments', () => {
        let freeDates = [appointment1];
        let knownAppointments = [];
        expect(getNewAppointementsOnly(freeDates, knownAppointments)).toStrictEqual(
            [appointment1]
        );
    });

    test('Same appointment known and received', () => {
        let freeDates = [appointment1];
        let knownAppointments = [appointment1];
        expect(getNewAppointementsOnly(freeDates, knownAppointments)).toStrictEqual(
            []
        );
    });

    test('Some known and some received', () => {
        let freeDates = [appointment1, appointment2, appointment3];
        let knownAppointments = [appointment3];
        expect(getNewAppointementsOnly(freeDates, knownAppointments)).toStrictEqual(
            [appointment1, appointment2]
        );
    });

    test('More known than new', () => {
        let freeDates = [appointment1];
        let knownAppointments = [appointment1, appointment2, appointment3];
        expect(getNewAppointementsOnly(freeDates, knownAppointments)).toStrictEqual(
            []
        );
    });
});
