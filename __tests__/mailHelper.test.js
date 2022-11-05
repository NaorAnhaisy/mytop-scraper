const { describe, expect, test } = require('@jest/globals');
const { getRelevantAppointmentsToUser } = require('../src/helpers/mailHelper');

const appointment1 = { date: new Date(2020, 4, 15), time: "10:00" };
const appointment2 = { date: new Date(2020, 4, 15), time: "10:40" };
const appointment3 = { date: new Date(2020, 4, 15), time: "11:00" };
const appointment4 = { date: new Date(2020, 4, 15), time: "17:00" };
const appointment5 = { date: new Date(2020, 4, 15), time: "17:40" };
const appointment6 = { date: new Date(2020, 4, 15), time: "18:00" };
const appointment7 = { date: new Date(2020, 4, 15), time: "18:40" };
const knownAppointments = [appointment1, appointment2, appointment3, appointment4, appointment5, appointment6, appointment7];

describe('Test relevant appointments to user works', () => {

    test('All hours', () => {
        const receiver = { name: "John", email: "first@gmail.com", startHour: 10, endHour: 18 };
        expect(getRelevantAppointmentsToUser(receiver, knownAppointments)).toStrictEqual(
            knownAppointments
        );
    });

    test('No hours at all', () => {
        const receiver = { name: "John", email: "first@gmail.com" };
        expect(getRelevantAppointmentsToUser(receiver, knownAppointments)).toStrictEqual(
            knownAppointments
        );
    });

    test('Start hour only', () => {
        const receiver = { name: "John", email: "first@gmail.com", startHour: 11 };
        expect(getRelevantAppointmentsToUser(receiver, knownAppointments)).toStrictEqual(
            [appointment3, appointment4, appointment5, appointment6, appointment7]
        );
    });

    test('End hour only', () => {
        const receiver = { name: "John", email: "first@gmail.com", endHour: 17 };
        expect(getRelevantAppointmentsToUser(receiver, knownAppointments)).toStrictEqual(
            [appointment1, appointment2, appointment3, appointment4, appointment5]
        );
    });
});