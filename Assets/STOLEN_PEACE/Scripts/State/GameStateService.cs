using System;
using System.Collections.Generic;
using UnityEngine;

namespace StolenPeace
{
    public enum ProgressFlag
    {
        Call_Done,
        Keys_Taken,
        InCar_FirstTime,
        Radio_News_Done,
        Gas_Items_3of3,
        Gas_NPC_Talked,
        Location2_Allowed,
        Deadline_Revealed,
        Day1_Objective_Done
    }

    public sealed class GameStateService : MonoBehaviour
    {
        public static GameStateService Instance { get; private set; }

        public event Action<ProgressFlag, bool> FlagChanged;

        private readonly HashSet<ProgressFlag> _flags = new();

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }

            Instance = this;
            DontDestroyOnLoad(gameObject);
        }

        public bool Has(ProgressFlag flag)
        {
            return _flags.Contains(flag);
        }

        public bool Set(ProgressFlag flag)
        {
            if (!_flags.Add(flag))
                return false;

            FlagChanged?.Invoke(flag, true);
            return true;
        }

        public bool Clear(ProgressFlag flag)
        {
            if (!_flags.Remove(flag))
                return false;

            FlagChanged?.Invoke(flag, false);
            return true;
        }

        public void ResetAll()
        {
            if (_flags.Count == 0)
                return;

            var previous = new List<ProgressFlag>(_flags);
            _flags.Clear();

            foreach (var flag in previous)
                FlagChanged?.Invoke(flag, false);
        }
    }
}
