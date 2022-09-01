import { createElement } from 'ardelon-create-element';

const loadPasswordGenerator = () => {
	//#region Generate Elements

	const pwgContainer = createElement({ classList: ['pwg-container'] });
	const pwgOutput = createElement({ classList: ['pwg-output'] });
	const pwgControlPanelOne = createElement({ classList: ['pwg-control-panel-one'] });
	const pwgControlPanelTwo = createElement({ classList: ['pwg-control-panel-two'] });

	const passwordTypeDropdown = createElement({
		type: 'select',
		classList: ['password-type-dropdown'],
		options: ['Random Password', 'Memorable Password', 'PIN'],
	});
	const refreshPasswordButton = createElement({ classList: ['refresh-password-button'] });
	const copyPasswordButton = createElement({ classList: ['copyPasswordButton'] });


  const selectDistanceSpan = createElement({
    type: "span",
    innerText: "12",
  });
  const sliderNest = createElement({
    classList: ["slider-nest"],
  });
  const sliderCover = createElement({
    classList: ["slider-cover"],
  });
  const sliderHandhold = createElement({ classList: ["slider-handhold"] });

	const lengthControlContainer = createElement({
		classList: ['password-length-control-container'],
	});

	//#endregion

	//#region State

	const state = {
		passType: 'Random Password',
		capitalize: false,
		fullWords: false,
		numbers: false,
		symbols: false,
		passLength: 8,
    parentElementSides : [],
	};

	//#endregion

	//#region Utilities

	const generateRadioInput = (labelText, key) => {
		const container = createElement({ classList: ['radio-input-container'] });
		const label = createElement({
			classList: ['input-label'],
			type: 'label',
			innerText: labelText,
		});

		const input = createElement({ classList: ['radio-input'], type: 'input' });
		input.type = 'checkbox';
		input.checked = state[key];
		input.addEventListener('click', () => {
			state[key] = !state[key];
		});
		container.append(label, input);
		return container;
	};

	const removeRadioInputs = () => {
		const elemArray = [...document.querySelectorAll('.radio-input-container')];
		elemArray.forEach((elem) => elem.remove());
	};

	const addGenericTypeRadioInputs = () => {
		const inputOne = generateRadioInput('Numbers', 'numbers');
		const inputTwo = generateRadioInput('Symbols', 'symbols');
		pwgControlPanelTwo.append(inputOne, inputTwo);
	};

	const addMemorableTypeRadioInputs = () => {
		const inputOne = generateRadioInput('Capitalize', 'capitalize');
		const inputTwo = generateRadioInput('Full Words', 'fullWords');
		pwgControlPanelTwo.append(inputOne, inputTwo);
	};

	const generatePassword = () => {};

	const refreshPassword = () => {
		generatePassword();
	};

	const copyPassword = () => {
		copy(pwgOutput.innerText);
	};

	const changePWgControlPanelTwo = (event) => {
		const selectedIndex = event.srcElement.options.selectedIndex;
		const optionArray = [...event.srcElement.options];
		const selectedValue = optionArray[selectedIndex].innerText;

		removeRadioInputs();
		if (selectedValue === 'Random Password') addGenericTypeRadioInputs();
		if (selectedValue === 'Memorable Password') addMemorableTypeRadioInputs();
		state.passType = selectedValue;
	};

    //#region Utility Functions
    const fnTrackMousePosition = (e) => {
      const { clientX: x, clientY: y } = e.touches[0];
      const [parentLeftSide, parentRightSide] = state.parentElementSides;
      if (x <= parentLeftSide + 16) {
        sliderHandhold.style.left = `0px`;
        sliderCover.style.width = "32px";
      } else if (x >= parentRightSide - 16) {
        sliderHandhold.style.left = `${parentRightSide - 48} px`;
        sliderCover.style.width = `${parentRightSide - 16} px`;
      } else {
        sliderHandhold.style.left = `${x - 48}px`;
        sliderCover.style.width = `${x - 16}px`;
      }
  
      const nestWidth = selectDistanceSliderNest.getBoundingClientRect().width;
      const coverWidth = selectDistanceSliderCover.getBoundingClientRect().width;
      const unitLength = nestWidth / 21;
      const floorDistance = Math.floor(coverWidth / unitLength);
      selectDistanceSpan.innerText = `${floorDistance} Km`;
      setSearchDistance(floorDistance);
    };

	//#endregion

	//#region Event Listeners

	passwordTypeDropdown.addEventListener('change', changePWgControlPanelTwo);
	refreshPasswordButton.addEventListener('click', refreshPassword);
	copyPasswordButton.addEventListener('click', copyPassword);

  sliderHandhold.addEventListener("touchstart", (e) => {
    const { x: parentLeftSide, width: parentWidth } =
      sliderNest.getBoundingClientRect();
    state.parentElementSides[0] = parentLeftSide;
    state.parentElementSides[1] = parentLeftSide + parentWidth;
    document.body.addEventListener("touchmove", fnTrackMousePosition);
  });

  document.body.addEventListener("touchend", () => {
    document.body.removeEventListener("touchmove", fnTrackMousePosition, false);
  });

	//#endregion

	//#region Append

  sliderCover.append(sliderHandhold);
  sliderNest.append(sliderCover);

	pwgControlPanelOne.append(passwordTypeDropdown, refreshPasswordButton, copyPasswordButton);
	pwgControlPanelTwo.append(sliderNest);

	pwgContainer.append(pwgOutput, pwgControlPanelOne, pwgControlPanelTwo);

	//#endregion

  addGenericTypeRadioInputs();
	generatePassword();
	return pwgContainer;
};

export default loadPasswordGenerator;
