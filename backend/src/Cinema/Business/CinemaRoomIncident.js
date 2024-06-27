export default class CinemaRoomIncident {
	setCinemaRoomIncidentId(cinemaRoomIncidentId) {
		this.cinemaRoomIncidentId = cinemaRoomIncidentId;
	}

	setCinemaRoom(cinemaRoom) {
		Object.assign(this, cinemaRoom);
	}

	setCinema(cinema) {
		Object.assign(this, cinema);
	}

	setIncident(incident) {
		this.incident = incident;
	}

	setLastModifiedAt(lastModifiedAt) {
		this.lastModifiedAt = lastModifiedAt;
	}
}
