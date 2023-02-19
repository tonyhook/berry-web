import { Component, Input, Output, ViewChild, ElementRef, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';

import { HierarchyManagedResource } from '../../core';

/** Item change event */
export class ItemChangeEvent {
  id = 0;
  type = '';
  oldValue: number | null = null;
  newValue: number | null = null;
}

/** Item change event */
export class ItemSelectEvent {
  id = 0;
}

/** New item event */
export class ItemNewEvent {
  name = '';
  parentId: number | null = null;
  sequence = 0;
}

/** Delete item event */
export class ItemDeleteEvent {
  id = 0;
}

/**
 * Node for hierarchy item
 */
export class HierarchyNode {
  id = 0;
  name = '';
  parent: HierarchyNode | null = null;
  sequence = 0;
  children?: HierarchyNode[] | null;
}

/** Flat hierarchy item node with expandable and level information */
export class HierarchyFlatNode {
  id = 0;
  name = '';
  level = 0;
  expandable = false;
}

/**
 * Node database, it can build a tree structured Json object.
 * Each node in Json object represents a hierarchy item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
export class Database {
  dataChange = new BehaviorSubject<HierarchyNode[]>([]);

  get data(): HierarchyNode[] {
    return this.dataChange.value;
  }

  constructor(nodes: HierarchyManagedResource[]) {
    this.initialize(nodes);
  }

  initialize(nodes: HierarchyManagedResource[]) {
    // Build the tree nodes from Json object. The result is a list of `HierarchyNode` with nested
    // node as children.
    const data = this.buildNodeTree(nodes);

    // Notify the change.
    this.dataChange.next(data);
  }

  /**
   * Build the tree. The `items` is the HierarchyManagedResource object array.
   * The return value is the list of `HierarchyNode`.
   */
  buildNodeTree(items: HierarchyManagedResource[]): HierarchyNode[] {
    const tree: HierarchyNode[] = [];
    const idMapping = items.reduce((acc: number[], el, i) => {
      if (el.id != null) {
        acc[el.id] = i;
      }
      return acc;
    }, []);

    const hierarchyNodes = items.reduce((acc: HierarchyNode[], el, i) => {
      const item: HierarchyNode = {
        id: el.id ? el.id : 0,
        name: el.name,
        parent: null,
        sequence: el.sequence ? el.sequence : 0,
        children: [],
      }
      acc[i] = item;
      return acc;
    }, []);

    items.forEach((el, i) => {
      if ((el.parentId == null) || (idMapping[el.parentId] == null)) {
        tree.push(hierarchyNodes[i]);
        tree.sort(function(a, b) {return a.sequence - b.sequence});
      } else {
        const parentEl = hierarchyNodes[idMapping[el.parentId]];
        parentEl.children = [...(parentEl.children || []), hierarchyNodes[i]];
        parentEl.children.sort(function(a, b) {return a.sequence - b.sequence});
        hierarchyNodes[i].parent = parentEl;
      }
    });

    return tree;
  }

  insertItem(parent: HierarchyNode | null, name: string) {
    const newItem = { name: name } as HierarchyNode;
    if (parent == null) {
      this.data.push(newItem);
      newItem.parent = null;
    } else {
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(newItem);
      newItem.parent = parent;
    }

    this.updateSequence(this.data);
    this.dataChange.next(this.data);
  }

  updateItem(node: HierarchyNode, name: string) {
    node.name = name;
    this.dataChange.next(this.data);
  }

  deleteItem(node: HierarchyNode) {
    this.deleteItemFromList(this.data, node);

    this.updateSequence(this.data);
    this.dataChange.next(this.data);
  }

  moveItemUnder(from: HierarchyNode, to: HierarchyNode) {
    // remove from from.parent.children
    const parentNode: HierarchyNode | null | undefined = from.parent;
    if (parentNode && parentNode.children) {
      const index = parentNode.children.indexOf(from, 0);
      parentNode.children.splice(index, 1);
    } else {
      const index = this.data.indexOf(from, 0);
      this.data.splice(index, 1);
    }
    // insert to to.parent
    from.parent = to;
    if (to != null) {
      if (to.children != null) {
        to.children.push(from);
      } else {
        to.children = [from];
      }
    }

    this.updateSequence(this.data);
    this.dataChange.next(this.data);
  }

  moveItemAbove(from: HierarchyNode, to: HierarchyNode) {
    // remove from from.parent.children
    let parentNode: HierarchyNode | null | undefined = from.parent;
    if (parentNode && parentNode.children) {
      const index = parentNode.children.indexOf(from, 0);
      parentNode.children.splice(index, 1);
    } else {
      const index = this.data.indexOf(from, 0);
      this.data.splice(index, 1);
    }
    // insert to to.parent.children
    parentNode = to.parent;
    from.parent = parentNode;
    if (parentNode && parentNode.children) {
      const index = parentNode.children.indexOf(to, 0);
      parentNode.children.splice(index, 0, from);
    } else {
      const index = this.data.indexOf(to, 0);
      this.data.splice(index, 0, from);
    }

    this.updateSequence(this.data);
    this.dataChange.next(this.data);
  }

  moveItemBelow(from: HierarchyNode, to: HierarchyNode) {
    // remove from from.parent.children
    let parentNode: HierarchyNode | null | undefined = from.parent;
    if (parentNode && parentNode.children) {
      const index = parentNode.children.indexOf(from, 0);
      parentNode.children.splice(index, 1);
    } else {
      const index = this.data.indexOf(from, 0);
      this.data.splice(index, 1);
    }
    // insert to to.parent.children
    parentNode = to.parent;
    from.parent = parentNode;
    if (parentNode && parentNode.children) {
      const index = parentNode.children.indexOf(to, 0);
      parentNode.children.splice(index + 1, 0, from);
    } else {
      const index = this.data.indexOf(to, 0);
      this.data.splice(index + 1, 0, from);
    }

    this.updateSequence(this.data);
    this.dataChange.next(this.data);
  }

  deleteItemFromList(nodes: HierarchyNode[], nodeToDelete: HierarchyNode) {
    const index = nodes.indexOf(nodeToDelete, 0);
    if (index > -1) {
      nodes.splice(index, 1);
    } else {
      nodes.forEach(node => {
        if (node.children && node.children.length > 0) {
          this.deleteItemFromList(node.children, nodeToDelete);
        }
      });
    }
  }

  updateSequence(nodes: HierarchyNode[]) {
    nodes.forEach((node, i) => {
      node.sequence = i;
      if (node.children && node.children.length > 0) {
        this.updateSequence(node.children);
      }
    });
  }
}

@Component({
  selector: 'berry-tree-view',
  templateUrl: './treeview.component.html',
  styleUrls: ['./treeview.component.scss'],
})
export class TreeViewComponent implements OnChanges {
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<HierarchyFlatNode, HierarchyNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<HierarchyNode, HierarchyFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: HierarchyFlatNode | null = null;

  treeControl: FlatTreeControl<HierarchyFlatNode>;

  treeFlattener: MatTreeFlattener<HierarchyNode, HierarchyFlatNode>;

  dataSource: MatTreeFlatDataSource<HierarchyNode, HierarchyFlatNode>;

  /** The selection for items */
  itemSelection = new SelectionModel<HierarchyFlatNode>(true /* multiple */);

  /* Drag and drop */
  dragNode: HierarchyFlatNode | null = null;
  dragNodeExpandOverWaitTimeMs = 500;
  dragNodeExpandOverNode: unknown;
  dragNodeExpandOverTime = 0;
  dragNodeExpandOverArea = 'center';

  @ViewChild('emptyNode') emptyNode: ElementRef | undefined;

  @Input() items: HierarchyManagedResource[] = [];
  @Input() itemId?: number | null;
  @Input() readOnly = false;
  @Output() itemChange: EventEmitter<ItemChangeEvent> = new EventEmitter();
  @Output() itemSelect: EventEmitter<ItemSelectEvent> = new EventEmitter();
  @Output() itemNew: EventEmitter<ItemNewEvent> = new EventEmitter();
  @Output() itemDelete: EventEmitter<ItemDeleteEvent> = new EventEmitter();

  database: Database = new Database([]);

  constructor() {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<HierarchyFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  }

  ngOnChanges(change: SimpleChanges) {
    if (Object.prototype.hasOwnProperty.call(change, 'items')) {
      if (change['items'].currentValue == null) {
        return;
      }

      this.items = change['items'].currentValue;

      if (this.database) {
        this.database.dataChange.unsubscribe();
      }
      this.database = new Database(this.items);

      // change detection
      this.database.dataChange.subscribe(data => {
        // flatten data
        const stack = [...data];
        const res: HierarchyNode[] = [];
        while (stack.length) {
          // pop value from stack
          const next = stack.pop();

          if (next) {
            if (next.children && next.children.length > 0) {
              // push back array items, won't modify the original input
              res.push(next);
              stack.push(...next.children);
            } else {
              res.push(next);
            }
          }
        }

        // change detection
        res.forEach(el => {
          if (el.id != null) {
            // existed item
            const item = this.items.find(item => item.id == el.id);
            if (typeof item !== 'undefined') {
              if (el.sequence != item.sequence) {
                // update item sequence
                const e: ItemChangeEvent = {
                  id: el.id,
                  type: 'sequence',
                  oldValue: item.sequence,
                  newValue: el.sequence,
                }
                this.itemChange.emit(e);

                item.sequence = el.sequence;
              }
              if (((el.parent == null) && (item.parentId != null))
                || ((el.parent != null) && (item.parentId == null))
                || ((el.parent != null) && (item.parentId != null) && (el.parent.id != item.parentId))
                ) {
                // update item parentId
                if (el.parent == null) {
                  const e: ItemChangeEvent = {
                    id: el.id,
                    type: 'parent',
                    oldValue: item.parentId,
                    newValue: null,
                  }
                  this.itemChange.emit(e);

                  item.parentId = null;
                } else {
                  const e: ItemChangeEvent = {
                    id: el.id,
                    type: 'parent',
                    oldValue: item.parentId,
                    newValue: el.parent.id,
                  }
                  this.itemChange.emit(e);

                  item.parentId = el.parent.id;
                }
              }
            }
          } else {
            if (el.name != '') {
              // new item
              let parentId: number | null = null;
              if (el.parent) {
                parentId = el.parent.id;
              }
              const e: ItemNewEvent = {
                name: el.name,
                sequence: el.sequence,
                parentId: parentId,
              }
              this.itemNew.emit(e);
            }
          }
        });

        this.items.forEach(item => {
          if (item.id) {
            const el = res.find(el => el.id == item.id);
            if (typeof el === 'undefined') {
              // delete item
              const e: ItemDeleteEvent = {
                id: item.id,
              }
              this.itemDelete.emit(e);
            }
          }
        });

        this.dataSource.data = [];
        this.dataSource.data = data;
      });

      if (this.itemId != null) {
        for (const node of this.flatNodeMap.keys()) {
          if (node.id == this.itemId) {
            this.selectNode(node);
            break;
          }
        }
      }
    }
  }

  getLevel = (node: HierarchyFlatNode): number => node.level;

  isExpandable = (node: HierarchyFlatNode): boolean => node.expandable;

  getChildren = (node: HierarchyNode): HierarchyNode[] | null | undefined => node.children;

  hasChild = (_: number, _nodeData: HierarchyFlatNode): boolean => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: HierarchyFlatNode): boolean => _nodeData.name == '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: HierarchyNode, level: number): HierarchyFlatNode => {
    let nestedNode = null;
    let flatNode: HierarchyFlatNode = new HierarchyFlatNode();

    for (const existedNestedNode of this.nestedNodeMap.keys()) {
      if (existedNestedNode.id == node.id) {
        nestedNode = existedNestedNode;
        break;
      }
    }

    if (nestedNode !== null) {
      const nestedNodeHierarchy = this.nestedNodeMap.get(nestedNode);
      if (nestedNodeHierarchy) {
        flatNode = nestedNodeHierarchy;
        this.flatNodeMap.delete(flatNode);
        this.nestedNodeMap.delete(nestedNode);
      }
    }

    flatNode.id = node.id;
    flatNode.name = node.name;
    flatNode.level = level;
    flatNode.expandable = (node.children != null && node.children.length > 0);
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  /** Whether a node is selected */
  isSelected(node: HierarchyFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    if (descendants.length == 0) {
      return this.itemSelection.isSelected(node);
    } else {
      return descendants.every(child => this.itemSelection.isSelected(child));
    }
  }

  /** Whether a node is partially selected */
  isPartiallySelected(node: HierarchyFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    if (descendants.length == 0) {
      return false;
    } else {
      const resultSome = descendants.some(child => this.itemSelection.isSelected(child));
      const resultAll = descendants.every(child => this.itemSelection.isSelected(child));
      return resultSome && !resultAll;
      }
  }

  /** Toggle the hierarchy item selection. Select/deselect all the descendants node */
  nodeSelectionToggle(node: HierarchyFlatNode): void {
    if (this.isPartiallySelected(node)) {
      this.itemSelection.select(node);
    } else {
      this.itemSelection.toggle(node);
    }
    const descendants = this.treeControl.getDescendants(node);
    this.itemSelection.isSelected(node)
      ? this.itemSelection.select(...descendants)
      : this.itemSelection.deselect(...descendants);
  }

  /** Add a new node */
  addNode(node: HierarchyFlatNode | null) {
    if (node) {
      const parentNode: HierarchyNode | undefined = this.flatNodeMap.get(node);
        if (typeof parentNode !== 'undefined') {
          this.database.insertItem(parentNode, '');
          this.treeControl.expand(node);
        }
    } else {
      this.database.insertItem(null, '');
    }
  }

  /** Save the node to database */
  saveNode(node: HierarchyFlatNode, itemValue: string) {
    const nestedNode: HierarchyNode | undefined = this.flatNodeMap.get(node);
    if (typeof nestedNode !== 'undefined') {
      this.database.updateItem(nestedNode, itemValue);
    }
  }

  /** Cancel the inserted node */
  cancelNode(node: HierarchyFlatNode) {
    const nestedNode: HierarchyNode | undefined = this.flatNodeMap.get(node);
    if (typeof nestedNode !== 'undefined') {
      this.database.deleteItem(nestedNode);
    }
  }

  /** Remove a node */
  removeNode(node: HierarchyFlatNode) {
    const nestedNode: HierarchyNode | undefined = this.flatNodeMap.get(node);
    if (typeof nestedNode !== 'undefined') {
      this.database.deleteItem(nestedNode);
    }
  }

  /** Select a node */
  selectNode(node: HierarchyFlatNode) {
    const e: ItemSelectEvent = {
      id: node.id,
    }
    this.itemSelect.emit(e);

    this.itemId = node.id;

    let nestedNode: HierarchyNode | null | undefined = this.flatNodeMap.get(node);
    while (nestedNode) {
      nestedNode = nestedNode.parent;
      if (nestedNode != null) {
        const nestedNodeFlat: HierarchyFlatNode | undefined = this.nestedNodeMap.get(nestedNode);
        if (typeof nestedNodeFlat !== 'undefined') {
          this.treeControl.expand(nestedNodeFlat);
        }
      }
    }
  }

  handleDragStart(event: DragEvent, node: HierarchyFlatNode) {
    // Required by Firefox (https://stackoverflow.com/questions/19055264/why-doesnt-html5-drag-and-drop-work-in-firefox)
    event.dataTransfer?.setData('foo', 'bar');
    if (typeof this.emptyNode !== 'undefined') {
      event.dataTransfer?.setDragImage(this.emptyNode.nativeElement, 0, 0);
    }
    this.dragNode = node;
    this.treeControl.collapse(node);
  }

  handleDragOver(event: DragEvent, node: HierarchyFlatNode) {
    event.preventDefault();

    const percentageY = event.offsetY / (<Element> event.target).clientHeight;

    // Handle node expand
    if (this.dragNode !== node) {
      if (node == this.dragNodeExpandOverNode) {
        if ((percentageY < 0.25) || (percentageY > 0.75)) {
          this.dragNodeExpandOverTime = 0;
        } else {
          if (this.dragNodeExpandOverTime == 0) {
            this.dragNodeExpandOverTime = new Date().getTime();
          }
          if (((new Date().getTime() - this.dragNodeExpandOverTime) > this.dragNodeExpandOverWaitTimeMs)) {
            if (!this.treeControl.isExpanded(node)) {
              this.treeControl.expand(node);
            }
          }
        }
      } else {
        if (this.treeControl.isExpanded(node)) {
          this.treeControl.collapse(node);
        }

        this.dragNodeExpandOverNode = node;
        if ((percentageY < 0.25) || (percentageY > 0.75)) {
          this.dragNodeExpandOverTime = 0;
        } else {
          this.dragNodeExpandOverTime = new Date().getTime();
        }
      }
    } else {
      this.dragNodeExpandOverNode = null;
      this.dragNodeExpandOverTime = 0;
      this.treeControl.collapse(node);
    }

    // Handle drag area
    if (percentageY < 0.25) {
      this.dragNodeExpandOverArea = 'above';
    } else if (percentageY > 0.75) {
      this.dragNodeExpandOverArea = 'below';
    } else {
      this.dragNodeExpandOverArea = 'center';
    }
  }

  handleDrop(event: DragEvent, node: HierarchyFlatNode) {
    event.preventDefault();

    if (node !== this.dragNode && this.dragNode && this.flatNodeMap.get(this.dragNode)) {
      const dragNodeHierarchy: HierarchyNode | undefined = this.flatNodeMap.get(this.dragNode);
      const nodeHierarchy: HierarchyNode | undefined = this.flatNodeMap.get(node);

      if (typeof dragNodeHierarchy !== 'undefined' && typeof nodeHierarchy !== 'undefined') {
        if (this.dragNodeExpandOverArea === 'above') {
          this.database.moveItemAbove(dragNodeHierarchy, nodeHierarchy);
        } else if (this.dragNodeExpandOverArea === 'below') {
          this.database.moveItemBelow(dragNodeHierarchy, nodeHierarchy);
        } else if (this.dragNodeExpandOverArea === 'center') {
          this.database.moveItemUnder(dragNodeHierarchy, nodeHierarchy);
        }
        this.treeControl.expandDescendants(this.dragNode);
      }
    }
    this.dragNode = null;
    this.dragNodeExpandOverNode = null;
    this.dragNodeExpandOverTime = 0;
  }

  handleDragEnd() {
    this.dragNode = null;
    this.dragNodeExpandOverNode = null;
    this.dragNodeExpandOverTime = 0;
  }

}
