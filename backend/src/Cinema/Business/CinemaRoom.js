export default class CinemaRoom {
	setCinemaRoomId(cinemaRoomId) {
		this.cinemaRoomId = cinemaRoomId;
	}

	setRoomNumber(roomNumber) {
		this.roomNumber = roomNumber;
	}

	setPlacementsMatrix(placementsMatrix) {
		this.placementsMatrix = placementsMatrix;
	}

	setCinema(cinema) {
		Object.assign(this, cinema);
	}

	setQuality(quality) {
		Object.assign(this, quality);
	}
}
