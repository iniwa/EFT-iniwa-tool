const CompResult = {
    props: ['shoppingList', 'collectedItems', 'expandedItems', 'displayLists'],
    emits: ['toggle-item-details', 'toggle-collected', 'open-task-from-name'],
    template: `
    <div class="row">
        <div v-for="(list, key) in displayLists" :key="key" class="col-xl-3 col-md-6 mb-3">
            <div class="card h-100" :class="list.borderClass">
                <div class="card-header" :class="list.headerClass">{{ list.title }}</div>
                <ul class="list-group list-group-flush overflow-auto" style="max-height: 70vh;">
                    <li v-for="item in list.items" :key="item.uid" class="list-group-item list-group-item-action">
                        <div class="d-flex align-items-center gap-2">
                            <input type="checkbox" class="form-check-input m-0" :checked="collectedItems.includes(item.uid)" @click.stop="$emit('toggle-collected', item.uid)">
                            <div class="d-flex justify-content-between align-items-center w-100" @click="$emit('toggle-item-details', item.uid)" style="cursor: pointer;">
                                <span :class="{'item-collected': collectedItems.includes(item.uid)}">{{ item.name }}</span>
                                <span class="badge" :class="[list.badgeClass, {'item-collected-badge': collectedItems.includes(item.uid)}]">{{ item.count }}</span>
                            </div>
                        </div>
                        <div v-if="expandedItems[item.uid]" class="mt-2 small text-muted border-top border-secondary pt-1">
                            <div v-for="source in item.sources" :key="source.name + source.type">
                                <span v-if="source.type === 'task' || source.type === 'collector'">
                                    ・<span class="source-task-link" @click="$emit('open-task-from-name', source.name)">{{ source.name }}</span> (x{{ source.count }})
                                </span>
                                <span v-else>
                                    ・{{ source.name }} (x{{ source.count }})
                                </span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    `
};