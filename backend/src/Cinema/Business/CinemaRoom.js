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

	setCreatedAt(createdAt) {
		this.createdAt = createdAt;
	}

	setUpdatedAt(updatedAt) {
		this.updatedAt = updatedAt;
	}

	setCinema(cinema) {
		Object.assign(this, cinema);
	}

	setQuality(quality) {
		Object.assign(this, quality);
	}
}
