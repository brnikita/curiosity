'use strict';

var _ = require('underscore');

/**
 * @module Curiosity
 */
module.exports = {
    /**
     * Method returns length between two points
     *
     * @public
     * @method
     * @name Curiosity.getLengthByTwoPoints
     * @param {Object} point1
     *                 point1.x
     *                 point1.y
     *                 point1.z
     *
     * @param {Object} point2
     *                 point2.x
     *                 point2.y
     *                 point2.z
     * @returns {number}
     */
    getLengthByTwoPoints: function (point1, point2) {
        return Math.sqrt(Math.pow((point1.x - point2.x), 2) + Math.pow((point1.y - point2.y), 2) + Math.pow((point1.z - point2.z), 2));
    },

    /**
     * Method returns time of passing from first point to second
     *
     * @public
     * @method
     * @name Curiosity.getTimeFromFirstPointToSecond
     * @param {Object} point1
     *                 point1.x
     *                 point1.y
     *                 point1.z
     *
     * @param {Object} point2
     *                 point2.x
     *                 point2.y
     *                 point2.z
     * @param {number} speed
     * @returns {number}
     */
    getTimeFromFirstPointToSecond: function (point1, point2, speed) {
        var length = this.getLengthByTwoPoints(point1, point2);

        return length / speed;
    },

    /**
     * Method returns time of off or landing to minimum flight height
     *
     * @public
     * @method
     * @name Curiosity.getUpDownTimeByMinFlightAltitude
     * @param minFlightAltitude
     * @param airSpeed
     * @returns {number}
     */
    getUpDownTimeByMinFlightAltitude: function (minFlightAltitude, airSpeed) {
        return minFlightAltitude / airSpeed;
    },

    /**
     * Method returns coordinate of point that belongs to ground line
     *
     * Ground line connects points with z = 0
     *
     * @public
     * @method
     * @name Curiosity.getGroundLinePoint
     * @param {Object} point1
     * @param {Object} point2
     * @param {number} pointNumber serial number of point on a line
     * @returns {Object}
     */
    getGroundLinePoint: function (point1, point2, pointNumber) {

    },

    /**
     * Method returns length of ground line
     *
     * Ground line connects points with z = 0
     *
     * @public
     * @method
     * @name Curiosity.getGroundLineLength
     * @param {Object} point1
     * @param {Object} point2
     * @returns {Object}
     */
    getGroundLineLength: function (point1, point2) {
        var pointGround1 = _.clone(point1),
            pointGround2 = _.clone(point1);

        pointGround1.z = 0;
        pointGround2.z = 0;

        return this.getLengthByTwoPoints(point1, point2);
    },

    /**
     * Method returns bets trip from first point to second
     *
     * {
     *  pointsList: [
     *    {
     *       x: 999,
     *       y: 999,
     *       z: 999
     *    }
     *  ],
     *  time: 9999
     * }
     *
     * @public
     * @method
     * @name Curiosity.getBestTripData
     * @param {Object} point1
     *                 point1.x
     *                 point1.y
     *                 point1.z
     *
     * @param {Object} point2
     *                 point2.x
     *                 point2.y
     *                 point2.z
     * @param {number} groundSpeed
     * @param {number} airSpeed
     * @param {number} minFlightAltitude minimum flight altitude
     * @returns {Object}
     */
    getBestTripData: function (point1, point2, groundSpeed, airSpeed, minFlightAltitude) {
        if (point1.z === 0 && point2.z === 0) {
            return this.getBestTripByGroundGround(point1, point2, groundSpeed, airSpeed, minFlightAltitude);
        }

        if (point1.z === 0 && point2.z > 0) {
            return this.getBestTripByGroundAir(point1, point2, groundSpeed, airSpeed);
        }

        if (point1.z > 0 && point2.z === 0) {
            return this.getBestTripByAirGround(point1, point2, groundSpeed, airSpeed);
        }
    },

    /**
     * Method returns best trip from first point to second by ground
     *
     * @public
     * @method
     * @name Curiosity.getBestTripByGroundGround
     * @param {Object} point1
     *                 point1.x
     *                 point1.y
     *                 point1.z
     *
     * @param {Object} point2
     *                 point2.x
     *                 point2.y
     *                 point2.z
     * @param {number} groundSpeed
     * @param {number} airSpeed
     * @param {number} minFlightAltitude minimum flight altitude
     * @returns {Object}
     */
    getBestTripByGroundGround: function (point1, point2, groundSpeed, airSpeed, minFlightAltitude) {
        var upDownTime = 2 * this.getUpDownTimeByMinFlightAltitude(minFlightAltitude, airSpeed),
            airTripTime = this.getTimeFromFirstPointToSecond(point1, point2, airSpeed),
            fullAirTime = airTripTime + upDownTime,
            groundSpeedTime = this.getTimeFromFirstPointToSecond(point1, point2, groundSpeed),
            pointAir1,
            pointAir2,
            pointsList = [];

        if (groundSpeedTime > fullAirTime) {
            pointsList.push(point1);
            pointsList.push(point2);

            return {
                pointsList: pointsList,
                time: groundSpeed
            }
        }

        pointsList = [];
        pointAir1 = _.clone(point1);
        pointAir1.z = minFlightAltitude;
        pointAir2 = _.clone(point2);
        pointAir2.z = minFlightAltitude;
        pointsList.push(point1);
        pointsList.push(pointAir1);
        pointsList.push(pointAir2);
        pointsList.push(point2);

        return {
            pointsList: pointsList,
            time: fullAirTime
        }
    },

    /**
     * Method returns best trip from first point to second by ground and air
     * Starts form ground
     *
     * @public
     * @method
     * @name Curiosity.getBestTripByGroundAir
     * @param {Object} point1
     *                 point1.x
     *                 point1.y
     *                 point1.z
     *
     * @param {Object} point2
     *                 point2.x
     *                 point2.y
     *                 point2.z
     * @param {number} groundSpeed
     * @param {number} airSpeed
     * @returns {Object}
     */
    getBestTripByGroundAir: function (point1, point2, groundSpeed, airSpeed) {
        var bestTime,
            bestTimePoints;

        return {
            pointsList: bestTimePoints,
            time: bestTime
        }
    },

    /**
     * Method returns best trip from first point to second by ground and air
     * Starts form air
     *
     * @public
     * @method
     * @name Curiosity.getBestTripByGroundAir
     * @param {Object} point1
     *                 point1.x
     *                 point1.y
     *                 point1.z
     *
     * @param {Object} point2
     *                 point2.x
     *                 point2.y
     *                 point2.z
     * @param {number} groundSpeed
     * @param {number} airSpeed
     * @returns {Object}
     */
    getBestTripByAirGround: function (point1, point2, groundSpeed, airSpeed) {
        var tripData = this.getBestTripByGroundAir(point2, point1, groundSpeed, airSpeed);

        tripData.pointsList.reverse();

        return tripData;
    }
};