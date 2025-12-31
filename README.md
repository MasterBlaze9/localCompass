# LocalCompass

LocalCompass is a web application designed to connect local communities by enabling users to share events, posts, and reports. The platform aims to foster engagement, communication, and collaboration within neighborhoods or interest groups.

## Project Idea
LocalCompass provides a space for users to:
- Create and discover local events
- Share posts and updates
- Report issues or concerns within the community
- Facilitate communication between users and administrators

## Project Structure
```
localCompass/
├── backend/
│   └── localCompass/
│       ├── src/
│       │   ├── main/
│       │   │   ├── java/io/codeForAll/    # Java backend source code
│       │   │   └── resources/             # Config, SQL, static, templates
│       │   └── test/
│       │       └── java/io/codeForAll/    # Backend tests
│       ├── pom.xml                        # Maven config
│       └── ...
├── frontend/
│   ├── js/                                # Main JS app, router, services, controllers, components
│   ├── css/                               # Stylesheets
│   ├── img/                               # Images
│   ├── view/                              # View logic and styles
│   ├── index.html, 404.html, ...          # Main HTML files
│   ├── package.json                       # Frontend dependencies
│   └── webpack configs                    # Webpack build configs
└── README.md
```

## Architecture
- **Frontend:**
	- Vanilla JavaScript (modular structure)
	- CSS for styling
	- Webpack for bundling
	- Organized by components, controllers, services, and views
- **Backend:**
	- Java (Spring Boot)
	- RESTful API
	- Maven for dependency management
	- SQL scripts for database schema and seed data
- **Communication:**
	- Frontend communicates with backend via REST API endpoints

## Tech Stack
- **Frontend:**
	- JavaScript (ES6+)
	- HTML5, CSS3
	- Webpack
- **Backend:**
	- Java 17+
	- Spring Boot
	- Maven
	- SQL
- **Other:**
	- Git & GitHub for version control

## Getting Started
1. **Backend:**
	 - Navigate to `backend/localCompass/`
	 - Run `./mvnw spring-boot:run` to start the backend server
2. **Frontend:**
	 - Navigate to `frontend/`
	 - Run `npm install` to install dependencies
	 - Run `npm start` or use Webpack to build and serve the frontend

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
See `LICENSE.txt` in the frontend directory.