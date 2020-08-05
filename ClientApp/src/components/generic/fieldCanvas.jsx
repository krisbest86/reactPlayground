import React, { Component } from "react";
import { findMaxLengthArrayOfArrays } from "../../library/utilsArray";
import {
  isMobileDevice,
  scrollTop,
  scrollLeft,
  isAtLeastSmallScreen
} from "../../library/utils";
import _ from "lodash";

const _selectedPlayer = new WeakMap();
const _targetPlayer = new WeakMap();
const _initiallySelectedPlayer = new WeakMap();
const _currentOnMove = new WeakMap();
const _currentOnEnd = new WeakMap();

class FieldCanvas extends Component {
  state = { isDesktop: {} };

  constructor(props) {
    super(props);
    this.state.isDesktop = !isMobileDevice();
  }

  render() {
    return (
      <div className="wrapper behaviour--centered">
        {/* {this.state.isDesktop ? <h2>desktop</h2> : <h2>mobile</h2>} */}
        {/* {<h2>current formation {this.props.currentFormation}</h2>} */}
        <canvas
          ref="canvasField"
          height={Math.min(700, 1.4 * (window.innerWidth - 50))}
          width={Math.min(500, window.innerWidth - 50)}
          style={{ margin: "0em" }}
        />
      </div>
    );
  }

  componentDidMount() {
    console.log(this.props.team);
    if (!this.state.isDesktop) {
      this.field.addEventListener("touchstart", this.touchDown);
    } else {
      this.field.addEventListener("mousedown", this.mouseDown);
    }

    for (const key in this.props.images) {
      if (this.props.images.hasOwnProperty(key)) {
        const img = this.props.images[key];
        img.onload = () => {
          this.drawField();
        };
      }
    }

    if (!this.props.team || !this.props.team.squad) return;

    this.drawField();
  }

  componentDidUpdate() {
    console.log(this.props.team);

    if (this.props.team && this.props.team.squad) this.drawField();
  }

  componentWillUnmount() {}

  get selectedPlayer() {
    return _selectedPlayer.get(this);
  }

  set selectedPlayer(value) {
    _selectedPlayer.set(this, value);
  }

  get currentOnMove() {
    return _currentOnMove.get(this);
  }

  set currentOnMove(value) {
    _currentOnMove.set(this, value);
  }

  get currentOnEnd() {
    return _currentOnEnd.get(this);
  }

  set currentOnEnd(value) {
    _currentOnEnd.set(this, value);
  }

  get initiallySelectedPlayer() {
    return _initiallySelectedPlayer.get(this);
  }

  set initiallySelectedPlayer(value) {
    _initiallySelectedPlayer.set(this, value);
  }

  get targetPlayer() {
    return _targetPlayer.get(this);
  }

  set targetPlayer(value) {
    _targetPlayer.set(this, value);
  }

  get fieldContext() {
    return this.refs.canvasField.getContext("2d");
  }

  get field() {
    return this.refs.canvasField;
  }

  get imgWidth() {
    if (this.props.team.squad)
      return (
        this.refs.canvasField.getContext("2d").canvas.width /
        (this.props.team.squad.reduce(findMaxLengthArrayOfArrays, 0) + 1)
      );
  }

  get imgHeight() {
    const { squad } = this.props.team;

    return this.fieldContext.canvas.height / squad.length / 2;
  }
  xButtonPosition = player => {
    return {
      x: player.X + this.imgWidth * 0.8,
      y: player.Y - this.imgHeight * 0.2,
      width: this.imgWidth * 0.3,
      height: this.imgHeight * 0.3
    };
  };

  get squad() {
    const { squad } = this.props.team;

    return squad;
  }

  playerFormation(player) {
    return Math.floor(
      (player.Y / this.fieldContext.canvas.height) * this.squad.length
    );
  }

  mouseX(eventX) {
    const scroll = this.state.isDesktop ? scrollLeft() : 0;

    return Math.min(
      this.fieldContext.canvas.width,
      Math.max(0, eventX + scroll - this.fieldContext.canvas.offsetLeft)
    );
  }

  mouseY(eventY) {
    const scroll = this.state.isDesktop ? scrollTop() : 0;

    return Math.min(
      this.fieldContext.canvas.height,
      Math.max(0, eventY + scroll - this.fieldContext.canvas.offsetTop)
    );
  }

  drawField() {
    const field = this.fieldContext;

    //formatting
    field.strokeStyle = "#FF0000";
    field.strokeRect(0, 0, field.canvas.width, field.canvas.height);

    this.drawPositiong();
  }

  drawPositiong() {
    const { squad } = this.props.team;

    for (const key in squad) {
      this.setFormationLine(
        this.fieldContext.canvas.height / squad.length,
        key * (this.fieldContext.canvas.height / squad.length),
        squad[key]
      );
    }

    this.drawTeam();
  }

  setFormationLine(height, startingHeight, formation) {
    const { squad } = this.props.team;

    const widthrange = this.fieldContext.canvas.width / (formation.length + 1);

    const imgWidth =
      this.fieldContext.canvas.width /
      (squad.reduce(findMaxLengthArrayOfArrays, 0) + 1);
    const imgHeight = height / 2;

    let startX = widthrange - imgWidth / 2;
    const startY = startingHeight + height / 2 - imgHeight / 2;

    for (const player of formation) {
      player.X = startX;
      player.Y = startY;

      startX += widthrange;
    }
  }

  drawTeam() {
    const { squad } = this.props.team;

    if (!squad) return;
    this.fieldContext.clearRect(
      0,
      0,
      this.fieldContext.canvas.width,
      this.fieldContext.canvas.height
    );

    //formatting
    this.fieldContext.strokeStyle = "#FF0000";
    this.fieldContext.strokeRect(
      0,
      0,
      this.fieldContext.canvas.width,
      this.fieldContext.canvas.height
    );

    this.fieldContext.font = `${this.imgWidth * 0.2}px arial`;
    this.fieldContext.fillStyle = "black";
    // this.fieldContext.font = "bold 10pt Courier";

    for (const formation of squad) {
      for (const player of formation) {
        if (
          !this.IsSelected(player) &&
          !(this.initiallySelectedPlayer === player)
        ) {
          this.drawPlayer(player);
        }
      }
    }

    // console.log(squad.find(this.IsSelected));
    if (this.initiallySelectedPlayer)
      this.drawPlayer(this.initiallySelectedPlayer);

    if (this.selectedPlayer && this.selectedPlayer.name)
      this.drawPlayer(this.selectedPlayer);
  }

  drawPlayer(player) {
    if (
      this.selectedPlayer &&
      this.selectedPlayer !== player &&
      this.IsFocus(this.selectedPlayer.X, this.selectedPlayer.Y, player)
    ) {
      this.targetPlayer = player;
    }

    //podswietl target player
    if (this.selectedPlayer && !this.IsSelected(player)) {
      if (this.IsSamePositiosAsSelected(player)) {
        this.fieldContext.beginPath();
        this.fieldContext.strokeStyle = "black";
        this.fieldContext.rect(
          player.X,
          player.Y - 5,
          this.imgWidth * 1,
          this.imgHeight * 1.3
        );
        this.fieldContext.stroke();
        if (
          this.IsFocus(this.selectedPlayer.X, this.selectedPlayer.Y, player)
        ) {
          this.fieldContext.fillStyle = "grey";
          this.fieldContext.fillRect(
            player.X,
            player.Y - 5,
            this.imgWidth * 1,
            this.imgHeight * 1.3
          );
        }
      }
    }
    // zaznaczony;
    if (this.initiallySelectedPlayer === player) {
      this.fieldContext.fillStyle = "lightblue";
      this.fieldContext.fillRect(
        player.X,
        player.Y - 2,
        this.imgWidth,
        this.imgHeight * 1.2
      );
      this.fieldContext.fillStyle = "black";
    }
    //narysuj koszulke
    this.fieldContext.drawImage(
      (player.name && this.props.images.defaultPlayerImg) ||
        this.props.images.noPlayer,
      player.X,
      player.Y,
      this.imgWidth,
      this.imgHeight
    );

    //wyswietl nazwe zawodnika
    if (player.name)
      this.fieldContext.fillText(
        player.name,
        player.X * (player.name.length > 10 ? 0.95 : 1) + this.imgWidth * 0.15,
        player.Y + this.imgHeight * 1.2,
        isAtLeastSmallScreen() ? 75 : 50
      );

    //wyswietl przycisk sprzedaj
    if (player.name) {
      const position = this.xButtonPosition(player);
      this.fieldContext.drawImage(
        player.name && this.props.images.xButton,
        position.x,
        position.y,
        position.width,
        position.height
      );
    }

    //wyswietl punkty
    if (
      player.name &&
      this.props.fixture &&
      new Date(this.props.fixture.from) < Date.now()
    ) {
      this.fieldContext.fillText(
        this.getPlayerPointsFixture(player),
        player.X + this.imgWidth * 0.5,
        player.Y + this.imgHeight * 1.45,
        isAtLeastSmallScreen() ? 40 : 20
      );
    }
  }

  mouseDown = event => {
    if (!this.fieldContext) return;

    const action = this.getAction(
      this.mouseX(event.clientX),
      this.mouseY(event.clientY)
    );
    if (action) {
      action.OnStart();
      this.currentOnMove = action.OnMove;
      this.currentOnEnd = action.OnEnd;
      this.field.addEventListener("mousemove", action.OnMove);
      this.field.addEventListener("mouseup", action.OnEnd);
    } else {
      this.initiallySelectedPlayer = null;
      this.drawField();
    }
  };

  touchDown = event => {
    if (!this.fieldContext) return;

    //prevent scrolling
    // event.preventDefault();
    const action = this.getAction(
      this.mouseX(event.touches[0].pageX),
      this.mouseY(event.touches[0].pageY)
    );

    if (action) {
      action.OnStart();
      this.currentOnMove = action.OnMove;
      this.currentOnEnd = action.OnEnd;
      this.field.addEventListener("touchmove", this.currentOnMove);
      this.field.addEventListener("touchend", this.currentOnEnd);
    } else {
      this.initiallySelectedPlayer = null;
      this.drawField();
    }
  };

  getPlayerPointsFixture(player) {
    const { team, fixture } = this.props;

    const fixtureId = fixture._id;
    const playerId = player._id;

    if (
      !team.playerPoints ||
      !fixtureId ||
      !playerId ||
      !team.playerPoints[fixtureId]
    )
      return "-";

    return team.playerPoints[fixtureId][playerId] || "-";
  }

  getAction(x, y) {
    if (this.props.gamesOn) return;

    for (const formation in this.squad) {
      for (const player of this.squad[formation]) {
        const positionSell = this.xButtonPosition(player);

        if (
          x > positionSell.x &&
          x < positionSell.x + positionSell.width &&
          y > positionSell.y &&
          y < positionSell.y + positionSell.height
        ) {
          return this.SellPlayerAction(player);
        } else if (this.IsFocus(x, y, player)) {
          return player.name
            ? this.DragAndDropPlayerAction(player, formation)
            : this.GetOnSelectPlayerAction(player);
        }
      }
    }

    return false;
  }

  GetOnSelectPlayerAction(player) {
    console.log(this.initiallySelectedPlayer);
    return !this.initiallySelectedPlayer
      ? this.SelectPlayerAction(player)
      : this.BuyPlayerAction(player);
  }

  IsFocus(x, y, player) {
    const factor = this.state.isDesktop ? 1.5 : 1;
    return (
      Math.abs(x - player.X - this.imgWidth / 4) < 30 * factor &&
      Math.abs(y - player.Y - this.imgHeight / 4) < 40 * factor
    );
  }

  SellPlayerAction(player) {
    return {
      Name: "SellPlayerAction",
      OnStart: () => {
        this.CleanPlayer(player);
        this.drawField();
      },
      OnMove: () => {},
      OnEnd: () => {}
    };
  }

  BuyPlayerAction(player) {
    return {
      Name: "BuyPlayerAction",
      OnStart: () => {
        // console.log("BuyPlayerAction");
        this.props.openTransferList({
          No: player.No,
          position: player.position
        });
      },
      OnMove: () => {},
      OnEnd: () => {
        // console.log("BuyPlayerAction END");

        this.initiallySelectedPlayer = null;
        this.removeListeners();

        this.drawTeam();
      }
    };
  }

  SelectPlayerAction(player) {
    return {
      Name: "SelectPlayerAction",
      OnStart: () => {
        console.log("SelectPlayerAction");

        this.initiallySelectedPlayer = player;
        console.log(this.initiallySelectedPlayer);
      },
      OnMove: () => {},
      OnEnd: () => {
        console.log("SelectPlayerAction END");
        this.removeListeners();

        this.drawTeam();
      }
    };
  }

  DragAndDropPlayerAction(player, formation) {
    return {
      Name: "DragAndDropPlayerAction",
      OnStart: () => {
        this.selectedPlayer = player;
        this.selectedPlayer["baseFormation"] = formation;
      },
      OnMove: event => {
        if (!this.state.isDesktop) event.preventDefault();

        if (this.selectedPlayer && this.selectedPlayer.name) {
          this.selectedPlayer.X = this.state.isDesktop
            ? this.mouseX(event.clientX)
            : this.mouseX(event.touches[0].pageX);
          this.selectedPlayer.Y = this.state.isDesktop
            ? this.mouseY(event.clientY)
            : this.mouseY(event.touches[0].pageY);
        }

        this.drawTeam();
      },
      OnEnd: () => {
        if (
          this.selectedPlayer &&
          this.selectedPlayer.name &&
          this.IsSamePositiosAsSelected(this.targetPlayer)
        ) {
          // console.log("swap");
          this.SwapPlayers();
        }

        this.removeListeners();

        this.selectedPlayer = null;
        this.targetPlayer = null;
        this.drawField();
      }
    };
  }

  SwapPlayers = () => {
    const selected = { ...this.selectedPlayer };
    const target = { ...this.targetPlayer };

    // console.log(selected);
    // console.log(target);
    for (const formation of this.squad) {
      for (const player of formation) {
        if (player === this.selectedPlayer) {
          formation.splice(formation.indexOf(player), 1, target);
        }
        if (player === this.targetPlayer) {
          formation.splice(formation.indexOf(player), 1, selected);
        }
      }
    }
  };

  IsSwapBetweenBenchAndField = () => {
    // console.log(this.playerFormation(this.selectedPlayer));
    const benchIndex = this.props.team.squad.length - 1;

    const { baseFormation } = this.selectedPlayer;
    return baseFormation == benchIndex
      ? this.playerFormation(this.selectedPlayer) < benchIndex
      : this.playerFormation(this.selectedPlayer) === benchIndex;
  };
  IsSelected = player => {
    if (!this.selectedPlayer || !player) return false;
    return this.selectedPlayer ? this.selectedPlayer.No === player.No : false;
  };
  IsSamePositiosAsSelected = player => {
    if (!this.selectedPlayer || !player) return false;
    return this.selectedPlayer
      ? this.selectedPlayer.position === player.position
      : false;
  };
  removeListeners() {
    console.log(this.state.isDesktop);
    if (this.state.isDesktop) {
      this.field.removeEventListener("mousemove", this.currentOnMove);
      this.field.removeEventListener("mouseup", this.currentOnEnd);
    } else {
      this.field.removeEventListener("touchmove", this.currentOnMove);
      this.field.removeEventListener("touchend", this.currentOnEnd);
    }
  }

  CleanPlayer(player) {
    for (const key in player) {
      if (key !== "X" && key !== "Y" && key !== "No") {
        this.props.sellPlayer(player);
        return;
      }
    }
  }
}

export default FieldCanvas;
