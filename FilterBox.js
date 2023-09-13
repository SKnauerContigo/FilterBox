(function () {
    // Define the HTML template for your custom element
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `

    <style>


      #loading_overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: none;
        z-index: 9999;
        allign-items: center;
        justify-content: center;
      }

      #loading_spinner {
       
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border: 4px solid #f3f3f3;
        border-top: 4px
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 2s linear infinite;
      }

      @keyframes spin {
        0% { transform: translate(-50%, -50%) rotate(0deg);}
        100% { transform: translate(-50%, -50%) rotate(360deg);}
      }

     

    </style>
 
    <button id="filter_button">Filter</button>

    <div class="child" >
    <label for="select_box_filter">Filter:</label>
          <input id="search" type="text" name="search" list="select_box_filter"/>
          <datalist id="select_box_filter">
          </datalist>          
    <button id="close_button">Close</button>
    </div>

    <div id="loading_overlay">
        <div id="loading_spinner"></div>
    </div>


    `;
  
    class FilterBox extends HTMLElement {
      constructor() {
        super();
        this.init();
      }
  
      init() {

        let shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(tmpl.content.cloneNode(true));

        var opt = document.createElement("option");
        const filterButton = shadowRoot.getElementById('filter_button');
        const searchBar = shadowRoot.getElementById('search');
        const memberList = shadowRoot.getElementById('select_box_filter');
        var loadingOverlad = shadowRoot.getElementById('loading_overlay');
        var ids = [];
        var desc = [];

        searchBar.addEventListener('keyup', function(e) {
          var searchterm = searchBar.value;
          console.log(searchterm)

            while (memberList.firstChild) {
              memberList.removeChild(memberList.lastChild);
            }
          
          if (searchterm.length >= 3) {
            console.log("Atleast 3 Characters entered")
           
            for (var k = 0; k < desc.length; k++) {
              if (desc[k].includes(searchterm)) {
                console.log("found member");
                const copy = opt.cloneNode(true);
                copy.value = copy.text = desc[k];
                memberList.appendChild(copy);
              }
            }
          }

        });
        

        // Add a click event listener to the "filter_button"
        filterButton.addEventListener('click', async () => {
            // Call the function or perform actions when the button is clicked
            // if (childDiv.style.display === 'none') {
            //     childDiv.style.display = 'flex';
            // } else {
            //     childDiv.style.display = 'none';
            // }
            loadingOverlad.style.display = "block";

            const dataBinding = this.dataBindings.getDataBinding('exportDataSource');
            var ds2 = await this.dataBindings.getDataBinding().getDataSource().getMembers('MDBELNR');
            console.log(ds2);

            var dimensions =  await this.dataBindings.getDataBinding().getDataSource().getDimensions();
            var dimensions_feed =  await this.dataBindings.getDataBinding().getDimensions("dimensions");
            var filteredDimensions = dimensions.filter((dimension) => {
                return dimensions_feed.includes(dimension.id);
              });
            // var members = ArrayUtils.create(Type.MemberInfo);
            // var value = InputField_1.getValue();
            
            var temp = '';
            var members;

            for (var i = 0; i < filteredDimensions.length; i++) {
                members =  await this.dataBindings.getDataBinding().getDataSource().getMembers(filteredDimensions[i], {limit: 1000000});
                for (var j = 0; j < members.length; j++) {
                    temp = filteredDimensions[i].id + ":" + members[j].id;
                    ids.push(temp);
                    temp = filteredDimensions[i].description + ":" + members[j].description;
                    desc.push(temp);
                    
                }
            }
            console.log("IDS");
            console.log(ids);
            console.log("DESCRIPTION");
            console.log(desc);
            console.log("done");
            loadingOverlad.style.display = "none";

        
          }


        );
      }
  
      fireChanged() {
        console.log('OnClick Triggered');
      }
    }
  
    // Define your custom element
    customElements.define('custom-button', FilterBox);
  })();