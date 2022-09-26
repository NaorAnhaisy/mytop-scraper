const { describe, expect, test } = require('@jest/globals');
const { getNewAppointementsOnly } = require('../src/helpers/arrayHelper');

const firstAppointment = { date: new Date(2020, 4, 15), hebrewDay: "ראשון", time: "10:40" };
const secondAppointment = { date: new Date(2020, 4, 15), hebrewDay: "ראשון", time: "11:40" };
const thirdAppointment = { date: new Date(2020, 4, 15), hebrewDay: "ראשון", time: "12:40" };

describe('Test sustracting new appointments from known appointments', () => {

    test('Only new appointments', () => {
        let freeDates = [firstAppointment];
        let knownAppointments = [];
        expect(getNewAppointementsOnly(freeDates, knownAppointments)).toStrictEqual(
            [firstAppointment]
        );
    });

    test('Same appointment known and received', () => {
        let freeDates = [firstAppointment];
        let knownAppointments = [firstAppointment];
        expect(getNewAppointementsOnly(freeDates, knownAppointments)).toStrictEqual(
            []
        );
    });

    test('Some known and some received', () => {
        let freeDates = [firstAppointment, secondAppointment, thirdAppointment];
        let knownAppointments = [thirdAppointment];
        expect(getNewAppointementsOnly(freeDates, knownAppointments)).toStrictEqual(
            [firstAppointment, secondAppointment]
        );
    });

    test('More known than new', () => {
        let freeDates = [firstAppointment];
        let knownAppointments = [firstAppointment, secondAppointment, thirdAppointment];
        expect(getNewAppointementsOnly(freeDates, knownAppointments)).toStrictEqual(
            []
        );
    });
});
