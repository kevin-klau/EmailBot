const baseURL = "http://127.0.0.1:3000/";

async function postCSV (file) {
	let formData = new FormData();
	formData.append("csv", file);

	try {
		const response = await fetch(baseURL + "file/0", {
			method: "POST",
			body: formData,
		});

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const data = await response.json();
		console.log(data);
		return data;
	} catch (error) {
		console.error("Fetch error:", error);
		throw error;
	}
};

async function getCSV (num) {

	try {
		const response = await fetch(baseURL + "file/" + num, {
			method: "GET",
		});

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const data = await response.json();
		console.log(data);
		return data;
	} catch (error) {
		console.error("Fetch error:", error);
		throw error;
	}
};

async function patchCSV (num, newText) {
	try {
		const response = await fetch(baseURL + "file/" + num, {
			method: "PUT",
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				body: newText
			})
		});

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const data = await response.json();
		console.log(data);
		return data;
	} catch (error) {
		console.error("Fetch error:", error);
		throw error;
	}
};

async function sendEmail(num) {
	try {
		const response = await fetch(baseURL + "email/" + num, {
			method: "GET",
		});
	} catch (error) {
		console.error("Fetch error:", error);
		throw error;
	}
};

async function logIn(user, pass, prompt){
    const payload = {
        "user": user,
        "passw": pass,
        "prompt": prompt
    };

    try{
        const response = await fetch(baseURL + "email/0", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
}


export { postCSV, getCSV, patchCSV, sendEmail, logIn};
