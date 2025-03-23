CREATE TYPE user_role AS ENUM ('admin', 'user');
CREATE TYPE event_status AS ENUM ('draft', 'published', 'cancelled');
CREATE TYPE reservation_status AS ENUM ('confirmed', 'cancelled');
CREATE TYPE event_category AS ENUM ('cinema', 'sport', 'concert', 'theatre', 'spectacle', 'gala', 'exposition', 'conference', 'other');

CREATE TABLE account (
    id_account UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    account_creation_date DATE DEFAULT CURRENT_DATE,
    role user_role NOT NULL DEFAULT 'user'
);

CREATE TABLE event (
    id_event UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date TIMESTAMP NOT NULL,
    location VARCHAR(255) NOT NULL,
    organizer VARCHAR(255) NOT NULL,
    category event_category NOT NULL,
    status event_status NOT NULL DEFAULT 'draft'
);

CREATE TABLE image (
    id_image UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    url TEXT NOT NULL,
    event_id UUID NOT NULL,
    FOREIGN KEY (event_id) REFERENCES event(id_event) ON DELETE CASCADE
);

CREATE TABLE ticket_type (
    id_ticket UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_name VARCHAR(255) NOT NULL,
    price INT NOT NULL,
    disponibility BOOLEAN NOT NULL DEFAULT TRUE,
    buying_limit INT NOT NULL,
    event_id UUID NOT NULL,
    FOREIGN KEY (event_id) REFERENCES event(id_event) ON DELETE CASCADE
);

CREATE TABLE reservation (
    id_reservation UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reservation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status reservation_status NOT NULL DEFAULT 'confirmed',
    account_id UUID NOT NULL,
    event_id UUID NOT NULL,
    FOREIGN KEY (account_id) REFERENCES account(id_account) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES event(id_event) ON DELETE CASCADE
);

CREATE TABLE reservation_ticket (
    id_reservation_ticket UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quantity INT NOT NULL,
    reservation_id UUID NOT NULL,
    ticket_type_id UUID NOT NULL,
    FOREIGN KEY (reservation_id) REFERENCES reservation(id_reservation) ON DELETE CASCADE,
    FOREIGN KEY (ticket_type_id) REFERENCES ticket_type(id_ticket) ON DELETE CASCADE
);