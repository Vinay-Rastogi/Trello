import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import ListColumn from "../components/ListColumn";
import RecommendationPanel from "../components/RecommendationPanel";
import styles from "./BoardPage.module.css";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import InviteMemberModal from "../components/InviteMemberModal";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const BoardPage = () => {
  const { boardId } = useParams();

  const [lists, setLists] = useState([]);
  const [cards, setCards] = useState({});
  const [newList, setNewList] = useState("");
  const [showInvite, setShowInvite] = useState(false);

  const navigate = useNavigate();

  const { user, loading } = useContext(AuthContext);

if (loading) return <div>Loading...</div>;
if (!user) {
  nav("/");
  return null;
}


  const loadBoard = async () => {
    const listRes = await API.get(`/lists/${boardId}`);
    const listsData = listRes.data;

    const cardMap = {};
    for (const list of listsData) {
      const cardsRes = await API.get(`/cards/${list._id}`);
      const unique = Array.from(
        new Map(cardsRes.data.map((c) => [c._id, c])).values()
      );
      cardMap[list._id] = unique;
    }

    setLists(listsData);
    setCards(cardMap);
  };

  useEffect(() => {
    loadBoard();
  }, []);

  const onDragEnd = async (result) => {
    const { source, destination, draggableId, type } = result;
    if (!destination) return;

    if (type === "LIST") {
      setLists((prevLists) => {
        const newOrder = Array.from(prevLists);
        const [moved] = newOrder.splice(source.index, 1);
        newOrder.splice(destination.index, 0, moved);

        API.post("/lists/reorder", {
          boardId,
          orderedIds: newOrder.map((l) => l._id),
        });

        return newOrder;
      });

      return;
    }

    const sourceList = source.droppableId;
    const destList = destination.droppableId;

    setCards((prev) => {
      const newCards = { ...prev };

      const sourceCards = Array.from(newCards[sourceList]);
      const destCards = Array.from(newCards[destList]);

      const [moved] = sourceCards.splice(source.index, 1);
      destCards.splice(destination.index, 0, moved);

      newCards[sourceList] = sourceCards;
      newCards[destList] = destCards;

      API.put(`/cards/${draggableId}`, { listId: destList });

      return newCards;
    });
  };

  const createList = async (e) => {
  e.preventDefault();

  if (!newList.trim()) {
    toast.warning("List name cannot be empty!");
    return;
  }

  try {
    const res = await API.post("/lists", {
      boardId,
      title: newList,
    });

    const newCreated = res.data;

    setLists((prev) => [...prev, newCreated]);
    setCards((prev) => ({ ...prev, [newCreated._id]: [] }));

    toast.success("List created successfully!");

    setNewList("");
  } catch (err) {
    toast.error(err.response?.data?.msg || "Failed to create list.");
  }
};
  return (
    <div className={styles.wrapper}>
      <div className={styles.mainArea}>
        <div className={styles.topBar}>
          <button
            onClick={() => navigate("/dashboard")}
            className={styles.backBtn}
          >
            ← Back to Boards
          </button>

          <button
            onClick={() => setShowInvite(true)}
            className={styles.inviteBtn}
          >
            + Invite Member
          </button>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="all-lists" type="LIST" direction="horizontal">
            {(provided) => (
              <div
                className={styles.listsContainer}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {lists.map((list, index) => (
                  <ListColumn
                    key={list._id}
                    list={list}
                    index={index}
                    cards={cards[list._id] || []}
                    setCards={setCards}
                    setLists={setLists}
                  />
                ))}

                {provided.placeholder}

                <form className={styles.newListForm} onSubmit={createList}>
                  <input
                    className={styles.newListInput}
                    placeholder="New List"
                    value={newList}
                    onChange={(e) => setNewList(e.target.value)}
                  />
                  <button className={styles.addListBtn}>Add</button>
                </form>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <RecommendationPanel boardId={boardId} />
      {showInvite && (
        <InviteMemberModal
          boardId={boardId}
          close={() => setShowInvite(false)}
          setShowInvite={setShowInvite}
        />
      )}
    </div>
  );
}

export default BoardPage;
