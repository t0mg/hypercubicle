import { DungeonChartData, DungeonChartNode, FlowState, RoomChoice } from '../types';
import { t } from '../text';

export class DungeonHistory {
  private _nodes: DungeonChartNode;
  private _path: string[] = ['start'];
  private _linkLabels: Record<string, string> = {};
  private _currentNode: DungeonChartNode;

  constructor(adventurerName: string) {
    this._nodes = {
      id: 'start',
      label: adventurerName,
      children: [],
    };
    this._currentNode = this._nodes;
  }

  public addRoomSelection(choices: RoomChoice[], chosenRoom: RoomChoice, flowState: FlowState) {
    // Add all choices as children of the current node
    choices.forEach(room => {
      this._currentNode.children.push({
        id: room.instanceId,
        label: `Floor ${this._path.length}: ${t('items_and_rooms.' + room.id)}`,
        children: [],
      });
    });

    // Move to the chosen room and update the path
    this._currentNode = this._currentNode.children.find(c => c.id === chosenRoom.instanceId)!;
    this._path.push(chosenRoom.instanceId);
    this._linkLabels[chosenRoom.instanceId] = t(`flow_states.${flowState}`);
  }

  public setRetirementNode() {
    this._currentNode.isRetirementNode = true;
  }

  public generateChartData(): DungeonChartData {
    return {
      nodes: this._nodes,
      path: this._path,
      linkLabels: this._linkLabels,
    };
  }

  public toJSON() {
    return {
      nodes: this._nodes,
      path: this._path,
      linkLabels: this._linkLabels,
      // We need to serialize the path to the current node
      currentNodePath: this._getNodePath(this._nodes, this._currentNode),
    };
  }

  private _getNodePath(root: DungeonChartNode, target: DungeonChartNode): string[] {
    const path: string[] = [];
    function find(node: DungeonChartNode): boolean {
      if (node.id === target.id) {
        path.push(node.id);
        return true;
      }
      for (const child of node.children) {
        if (find(child)) {
          path.push(node.id);
          return true;
        }
      }
      return false;
    }
    find(root);
    return path.reverse();
  }

  public static fromJSON(data: any): DungeonHistory {
    const history = new DungeonHistory('');
    history._nodes = data.nodes;
    history._path = data.path;
    history._linkLabels = data.linkLabels;

    // We need to reconstruct the current node from the path
    let currentNode = history._nodes;
    for (let i = 1; i < data.currentNodePath.length; i++) {
      currentNode = currentNode.children.find(c => c.id === data.currentNodePath[i])!;
    }
    history._currentNode = currentNode;

    return history;
  }
}
